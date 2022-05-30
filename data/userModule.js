const bcrypt = require("bcrypt");
const tokens = require("./tokens");
const validationModule = require("./validationModule");
const mediaModule = require('./mediaModule');
const database = require('./database');
const {dbManager} = require("./database");

module.exports.login = (db) => {
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
            res.status(400).json({errors});
            return;
        }

        if (!validationModule.isEmailAddress(email)) {
            errors.push('You must supply a valid email address');
            res.status(400).json({errors});
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

module.exports.register = (db) => {
    return async (req, res) => {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const displayName = req.body.displayName;
        const email = req.body.email;
        const password = req.body.password;

        const errors = validationModule.allStringsInArrayAreNotEmpty([
            {
                "name": "firstName",
                "value": firstName
            },
            {
                "name": "lastName",
                "value": lastName,
            },
            {
                "name": "displayName",
                "value": displayName,
            },
            {
                "name": "email",
                "value": email,
            },
            {
                "name": "password",
                "value": password,
            },
        ]);

        if (errors.length !== 0) {
            res.status(400).json({errors});
            return;
        }

        if (!validationModule.isEmailAddress(email)) {
            errors.push('You must supply a valid email address');
            res.status(400).json({errors});
            return;
        }

        if (password.length < 6) {
            errors.push('Your password must be at least 6 characters long');
            res.status(400).json({errors});
            return;
        }

        const databaseManager = database.dbManager;

        try {
            // Make sure the user doesn't already exist in the system.
            const user = await getUserByEmail(databaseManager, email, false);

            console.log("User", user);

            if (user) {
                errors.push(`This email address is already registered with us`);
                res.status(400).json({errors});
                return;
            }

            const saltRounds = 10;

            // Hash the users password and store the user in our database.
            bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
               if (err) {
                   errors.push(`Failed to encrypt user password`);
                   res.status(400).json({errors});
                   return;
               }

               const params = [firstName, lastName, displayName, email, '', hashedPassword];

               try {
                   // Insert the new user
                   await dbManager.execute(sqlStatements.insertUser, params);

                   // Load the user and then delete the password attribute so we don't send that back to the client.
                   const user = await getUserByEmail(databaseManager, email);
                   delete user.password;

                   // Log the user in.
                   const userIpAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                   const token = await tokens.createToken(databaseManager, user.id, req.headers['user-agent'], userIpAddress);

                   res.status(200).json({
                       "tokenInfo": token,
                       user
                   });

               } catch (error) {
                   errors.push(`Registration failed: ${error}`);
                   res.status(400).json({errors});
               }
            });
        } catch (error) {
            errors.push(error.toString());
            res.status(400).json({errors});
        }
    }
}

module.exports.uploadProfilePhoto = (db, config) => {
    return async (req, res) => {
        const errors = [];

        const token = req.token;
        if (!token) {
            errors.push('no token found');
            return res.status(400).json({errors});
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
            return res.status(400).json({errors});
        }

        // Make sure the file has a supported mime type (jpeg or png)
        const mediaService = mediaModule.getMediaService(config);

        const extension = mediaService.getImageExtension(profilePhotoFile);
        if (extension === '') {
            errors.push('Invalid file type');
            return res.status(400).json({errors});
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
                return res.status(500).json({errors});
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