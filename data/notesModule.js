const validationModule = require("./validationModule");
const uuid = require('uuid');
const path = require('path');

const mediaModule = require("./mediaModule");

// const validNoteStyles = ['polaroid', 'postcard', 'stickynote'];

module.exports.getNotesForLoggedInUser = (db) => {
    return async (req, res) => {
        const errors = [];

        const token = req.token;
        if (!token) {
            errors.push('no token found');
            return res.status(500).json({ errors });
        }

        console.log('user id', token.userId, sqlStatements.getNotesForRecipient)

        const notes = [];
        await db.each(sqlStatements.getNotesForRecipient, [token.userId], (err, row) => {
            if (err) {
                errors.push('Failed to load notes');
                return res.status(500).json({ errors });
            }
            notes.push(row);
        }, () => {
            return res.status(200).json(notes)
        });
    }
};

module.exports.createNote = (db, config) => {
    return async (req, res) => {
        let errors = [];
        const token = req.token;

        if (!token) {
            errors.push('no token found');
            return res.status(500).json({ errors });
        }

        // Every note MUST have a style.
        const style = req.body.style;
        const recipientsList = req.body.recipientsList;

        // Message however may be empty/null.
        let message = null;

        if ((req.body.hasOwnProperty('message')) && (req.body.message.length > 0)) {
            message = req.body.message;
        }

        errors = validationModule.allStringsInArrayAreNotEmpty([
            {
                "name": "style",
                "value": style
            },
        ]);

        if (errors.length !== 0) {
            return res.status(400).json({ errors });
        }

        // Make sure the note style is one of the valid ones (see top of this file for the definition).
        // if (validNoteStyles.indexOf(style) < 0) {
        //     errors.push('invalid note style type')
        //     return res.status(400).json({ errors });
        // }

        if (!validationModule.isNonEmptyArray(recipientsList)) {
            errors.push('recipientsList must be a non-empty array');
            return res.status(400).json({ errors });
        }

        // Ensure each item in the recipientsList is a number.
        for (const recipient of recipientsList) {
            if (!validationModule.isPositiveInteger(recipient)) {
                errors.push(`recipientsList item ${recipient} is not a valid positive number`);
            }
        }

        // Insert the note into the database
        const params = [token.userId, message, null, style];

        db.run(sqlStatements.insertNote, params, async (err) => {
            if (err) {
                errors.push(`Failed to insert note`);
                return res.status(400).json({ errors });
            }

            db.get(sqlStatements.getLastInsertId, [], async (err, row) => {
                if (err) {
                    errors.push(`Failed to get last inserted note id`);
                    return res.status(400).json({ errors });
                }

                const newNoteId = row.id;

                const insertNextRecipient = (recipientIndex) => {
                    const recipientId = recipientsList[recipientIndex];

                    // TODO: We will need to check if the recipient is actually a friend of the logged in user.

                    db.run(sqlStatements.insertNoteRecipient, [newNoteId, recipientId], (err) => {
                        if (err) {
                            errors.push(`Failed to insert note recipient`);
                            console.log('error', err);
                            return res.status(400).json({ errors });
                        }

                        if (recipientIndex < (recipientsList.length - 1)) {
                            insertNextRecipient(++recipientIndex);
                        } else {
                            return res.status(200).json({
                                "success": true,
                                "note": {
                                    "id": newNoteId,
                                    "message": message,
                                    "style": style,
                                    "imageUrl": null,
                                    "recipientsList": recipientsList
                                }
                            });
                        }
                    });
                }

                // Insert all the recipients
                insertNextRecipient(0);
            })
        });
    }
}

module.exports.uploadNotePhoto = (db, config) => {
    return async (req, res) => {
        let errors = [];
        const token = req.token;

        if (!token) {
            errors.push('no token found');
            return res.status(500).json({ errors });
        }

        // Get note id from URL.
        if (!req.files || (req.files.length === 0)) {
            errors.push('No profile photo was uploaded');
            return res.status(400).json({ errors });
        }

        const notePhotoFile = req.files.notePhoto;
        if (!notePhotoFile) {
            errors.push('No note photo was uploaded');
            return res.status(400).json({ errors });
        }

        // The noteId must be provided in the URL, and it MUST be a positive integer.
        const noteId = parseInt(req.params.noteId, 10);

        if (!validationModule.isPositiveInteger(noteId)) {
            errors.push('noteId must be a positive integer');
            return res.status(400).json({ errors });
        }

        // Load the note and make sure it belongs to the logged-in user
        db.get(sqlStatements.getNoteById, [noteId], async (err, note) => {
            if (err) {
                errors.push('Failed to load note', err.toString());
                return res.status(500).json({ errors });
            }

            if (!note) {
                errors.push('Could not find note');
                return res.status(500).json({ errors });
            }

            if (note.createdByID !== token.userId) {
                errors.push('Permission denied');
                return res.status(403).json({ errors });
            }


            // Get the uploaded file
            const mediaService = mediaModule.getMediaService(config);

            // Make sure it's a jpeg or png file.
            const extension = mediaService.getImageExtension(notePhotoFile);
            if (extension === '') {
                errors.push('Invalid note photo file type');
                return res.status(400).json({ errors });
            }

            // Use a UUID as the name of the file.
            const notePhotoUuid = uuid.v4();

            // Figure out the store paths, urls etc.
            const fileName = notePhotoUuid + "." + extension;
            const thumbName = notePhotoUuid + "_tmb." + extension;
            const imageUri = path.join('uploads', 'notes', fileName);
            const thumbUri = path.join('uploads', 'notes', thumbName);
            const uploadPath = path.join(__dirname, 'public', imageUri);
            const uploadPathThumb = path.join(__dirname, 'public', thumbUri);

            // Final url
            let host = config.server.host;
            if ((config.server.port !== 80) && (config.server.port !== 443)) {
                host += `:${config.server.port}`;
            }

            const imageUrl = host + '/uploads/notes/' + fileName;

            try {
                console.log('upload path', uploadPath)
                // Move the file to its final destination.
                await mediaService.moveImage(notePhotoFile, uploadPath);

                // Create the thumbnail from the original image
                await mediaService.resizePhoto(uploadPath, uploadPathThumb, 800);

                // And resize the original image to be no greater than 1200
                await mediaService.resizePhoto(uploadPath, uploadPath, 1200);

                // Update the note in the database with the url of the uploaded image.
                db.run(sqlStatements.setNoteImageUrl, [imageUrl, noteId], (err) => {
                    if (err) {
                        errors.push('Failed to update node with image url');
                        return res.status(500).json({ errors });
                    }

                    return res.status(200).json({
                        'success': true,
                        'imageUrl': imageUrl
                    });
                });
            } catch (error) {
                errors.push('Failed to handle uploaded note image: ' + error.toString());
                return res.status(500).json({ errors });
            }
        });
    }
}

const sqlStatements = {
    "getNoteById": `
    SELECT id, createdById, message, imageUrl, style
    FROM notes
    WHERE id = ?
    `,
    "getNotesForRecipient": `
    SELECT n.id, n.createdById, n.message, n.imageUrl, n.style
    FROM notes n
    INNER JOIN recipients r ON n.id = r.noteId
    WHERE r.recipientId = ?
    `,
    "insertNote": `
    INSERT INTO notes (createdById, message, imageUrl, style)
    VALUES(?, ?, ?, ?);
    `,
    "insertNoteRecipient": `
    INSERT INTO recipients (noteId, recipientId)
    VALUES(?, ?);
    `,
    "getLastInsertId": "select last_insert_rowid() as id",
    "setNoteImageUrl": `
    UPDATE notes
    SET imageUrl = ?
    WHERE id = ?
    `,
}