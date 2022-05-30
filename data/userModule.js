const bcrypt = require("bcrypt");
const tokens = require("./tokens");
const validationModule = require("./validationModule");
const mediaModule = require('./mediaModule');
const database = require('./database');
const userRegistrationService = require('./modules/users/services/userRegistrationService');

module.exports.login = () => {
    return async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;

        const errors = validationModule.allStringsInArrayAreNotEmpty([
            {
                "name": "email",
                "value": email,
            },
            {
                "name": "password",
                "value": password,
            }
        ]);

        if (errors.length !== 0) {
            res.status(400).json({ errors });
            return;
        }

        if (!validationModule.isEmailAddress(email)) {
            errors.push('You must supply a valid email address');
            res.status(400).json({ errors });
            return;
        }

        const databaseManager = database.dbManager;

        try {
            const user = await getUserByEmail(databaseManager, email);

            bcrypt.compare(password, user.password, async (err, success) => {
                if (err) {
                    res.status(500).json({
                        'error': err.toString()
                    });
                    return;
                }

                if (success) {
                    delete user.password;

                    const userIpAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

                    try {
                        const token = await tokens.createToken(databaseManager, user.id, req.headers['user-agent'], userIpAddress);

                        res.status(200).json({
                            "tokenInfo": token,
                            user
                        });
                    } catch (error) {
                        res.status(500).json({
                            'error': error.toString()
                        });
                    }
                } else {
                    res.status(400).json({
                        'error': "Login failed"
                    });
                }
            });
        } catch (error) {
            res.status(400).json({
                'error': 'Login failed'
            });
        }
    }
}

module.exports.register = () => {
    return async (req, res) => {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const displayName = req.body.displayName;
        const email = req.body.email;
        const password = req.body.password;

        const userIpAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'] || 'NoUserAgent';

        const databaseManager = database.dbManager;
        const result = await userRegistrationService.do(databaseManager, firstName, lastName, displayName, email, password, userIpAddress, userAgent);

        if (result.errors.length > 0) {
            res.status(400).json({ "errors": result.errors });
            return;
        }

        return res.status(200).json({
            "tokenInfo": result.token,
            "user": result.user,
        });
    }
}

module.exports.uploadProfilePhoto = (config) => {
    return async (req, res) => {
        const errors = [];

        const token = req.token;
        if (!token) {
            errors.push('no token found');
            return res.status(400).json({ errors });
        }

        // Make sure a file with the correct name was uploaded
        if (!req.files || (req.files.length === 0)) {
            errors.push('No files were found');
            return res.status(400).json({errors});
        }

        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        const profilePhotoFile = req.files.profilePhoto;
        if (!profilePhotoFile) {
            errors.push('No profile photo was uploaded');
            return res.status(400).json({ errors });
        }

        // Make sure the file has a supported mime type (jpeg or png)
        const mediaService = mediaModule.getMediaService(config);

        const extension = mediaService.getImageExtension(profilePhotoFile);
        if (extension === '') {
            errors.push('Invalid file type');
            return res.status(400).json({ errors });
        }

        // Figure out the paths and urls for storage.
        const imageUri = 'uploads/profile/profile_' + token.userId + "." + extension;
        const thumbUri = 'uploads/profile/profile_' + token.userId + "_tmb." + extension;
        const uploadPath = __dirname + '/public/' + imageUri;
        const uploadPathThumb = __dirname + '/public/' + thumbUri;

        // Final url
        let host = config.server.host;
        if ((config.server.port !== 80) && (config.server.port !== 443)) {
            host += `:${config.server.port}`;
        }

        const uploadUrl = host + `/${imageUri}`;

        // Move the uploaded file to the correct storage path.
        await profilePhotoFile.mv(uploadPath, async (err) => {
            if (err) {
                errors.push('Failed to move uploaded file');
                return res.status(500).json({ errors });
            }

            try {
                // Create the thumbnail from the original image
                await mediaService.resizePhoto(uploadPath, uploadPathThumb, 120);

                // Resize the original image to be only 400px wide
                await mediaService.resizePhoto(uploadPath, uploadPath, 400);

                // The image has now been uploaded and resized, update the user database with the imageUrl
                const databaseManager = database.dbManager;

                await databaseManager.execute(sqlStatements.updateUserPhoto, [uploadUrl, token.userId]);

                return res.send({
                    "success": true,
                    "imageUrl": uploadUrl,
                });
            } catch (err) {
                errors.push('Failed to upload user photo: ' + err.toString());
                return res.status(500).json({errors});
            }
        });
    }
}

/***
 *
 * @param databaseManager
 * @param email
 * @param exceptionIfNotExisting
 * @returns {Promise<unknown>}
 */
const getUserByEmail = async (databaseManager, email, exceptionIfNotExisting = true) => {
    const user = await databaseManager.getRow(sqlStatements.getUserByEmail, [email]);

    // If no matching user was found, return a login failure message.
    if (!user) {
        if (exceptionIfNotExisting) {
            throw new Error(`could not find user with email ${email}`);
        }
    }

    return user;
}

const sqlStatements = {
    getUserByEmail: `
    SELECT id, firstName, lastName, displayName, imageURL, email, password
    FROM users
    WHERE email = ?
    `,
    insertUser: `
    INSERT INTO users(firstName, lastName, displayName, email, uid, password)
    VALUES(?, ?, ?, ?, ?, ?);
    `,
    updateUserPhoto: `
    UPDATE users
    SET imageUrl = ?
    WHERE id = ?;
    `,
}