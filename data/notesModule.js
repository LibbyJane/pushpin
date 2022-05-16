const validationModule = require("./validationModule");
const uuid = require('uuid');

const mediaModule = require("./mediaModule");

const validNoteStyles = ['polaroid', 'postcode', 'stickyNote'];

module.exports.getNotesForLoggedInUser = (db) => {
    return async (req, res) => {
        const errors = [];

        const token = req.token;
        if (!token) {
            errors.push('no token found');
            return res.status(500).json({errors});
        }

        const notes = [];
        await db.each(sqlStatements.getNotesForRecipient, [token.userId], (err, row) => {
            if (err) {
                errors.push('Failed to load notes');
                return res.status(500).json({errors});
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
            return res.status(500).json({errors});
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
            return res.status(400).json({errors});
        }

        // Make sure the note style is one of the valid ones (see top of this file for the definition).
        if (validNoteStyles.indexOf(style) < 0) {
            errors.push('invalid note style type')
            return res.status(400).json({errors});
        }

        if (!validationModule.isNonEmptyArray(recipientsList)) {
            errors.push('recipientsList must be a non-empty array');
            return res.status(400).json({errors});
        }

        // Ensure each item in the recipientsList is a number.
        for (const recipient of recipientsList) {
            if (!validationModule.isPositiveInteger(recipient)) {
                errors.push(`recipientsList item ${recipient} is not a valid positive number`);
            }
        }

        // There may no be image uploaded.
        let imageUrl = null;

        if (req.files && (req.files.notePhoto)) {
            // Attempt to upload the note photo
            const mediaService = mediaModule.getMediaService(config);

            // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
            const notePhotoFile = req.files.notePhoto;
            console.log('Mime type is: ', notePhotoFile.mimetype);

            const extension = mediaService.getImageExtension(notePhotoFile);
            if (extension === '') {
                errors.push('Invalid note photo file type');
                return res.status(400).json({errors});
            }

            const notePhotoUuid = uuid.v4();

            const imageUri = 'uploads/note/' + notePhotoUuid + "." + extension;
            const thumbUri = 'uploads/note/' + notePhotoUuid + "_tmb." + extension;
            const uploadPath = __dirname + '/public/' + imageUri;
            const uploadPathThumb = __dirname + '/public/' + thumbUri;

            // Final url
            let host = config.server.host;
            if ((config.server.port !== 80) && (config.server.port !== 443)) {
                host += `:${config.server.port}`;
            }

            imageUrl = host + `/${imageUri}`;

            try {
                await mediaService.moveImage(notePhotoFile, uploadPath);

                // Create the thumbnail from the original image
                await mediaService.resizePhoto(uploadPath, uploadPathThumb, 800);

                // And resize the original image to be no greater than 1200
                await mediaService.resizePhoto(uploadPath, uploadPath, 1200);
            } catch (error) {
                errors.push('Failed to handle uploaded note image: ' + error.toString());
                return res.status(500).json({errors});
            }
        }

        // Both the imageUrl and message should not be empty - this is an invalid state
        if (!imageUrl && !message) {
            errors.push('Both the message and the note image may not be empty/null');
            return res.status(500).json({errors});
        }

        // Insert the note into the database
        const params = [token.userId, message, imageUrl, style];

        db.run(sqlStatements.insertNote, params, async (err) => {
            if (err) {
                errors.push(`Failed to insert note`);
                return res.status(400).json({errors});
            }

            db.get(sqlStatements.getLastInsertId, [], async (err, row) => {
                if (err) {
                    errors.push(`Failed to get last inserted note id`);
                    return res.status(400).json({errors});
                }

                const newNoteId = row.id;

                const insertNextRecipient = (recipientIndex) => {
                    const recipientId = recipientsList[recipientIndex];

                    // TODO: We will need to check if the recipient is actually a friend of the logged in user.

                    db.run(sqlStatements.insertNoteRecipient, [newNoteId, recipientId], (err) => {
                        if (err) {
                            errors.push(`Failed to insert note recipient`);
                            console.log('error', err);
                            return res.status(400).json({errors});
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
                                    "imageUrl": imageUrl,
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

const sqlStatements = {
    "getNotesForRecipient": `
    SELECT n.id, n.createdById, n.message, n.imageUrl, n.style
    FROM notes n
    INNER JOIN recipients r ON n.id = r.note_id
    WHERE r.recipient_id = ?    
    `,
    "insertNote": `
    INSERT INTO notes (createdById, message, imageUrl, style)
    VALUES(?, ?, ?, ?);    
    `,
    "insertNoteRecipient": `
    INSERT INTO recipients (noteId, recipientId)
    VALUES(?, ?);    
    `,
    "getLastInsertId": "select last_insert_rowid() as id"
}