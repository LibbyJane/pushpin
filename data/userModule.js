const bcrypt = require("bcrypt");
const tokens = require("./tokens");
const validationModule = require("./validationModule");
const im = require("imagemagick");
const config = require("./config.json");
const mediaModule = require('./mediaModule');

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

        const stmt = db.prepare(sqlStatements.getUserByEmail);

        try {
            const user = await getUserByEmail(db, email);

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
                        const token = await tokens.createToken(db, user.id, req.headers['user-agent'], userIpAddress);

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

        try {
            // Make sure the user doesn't already exist in the system.
            const user = await getUserByEmail(db, email, false);

            if (user) {
                errors.push(`This email address is already registered with us`);
                res.status(400).json({errors});
                return;
            }

            const saltRounds = 10;

            // Hash the users password and store the user in our database.
            bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
               if (err) {
                   errors.push(`Failed to encrypt user password`);
                   res.status(400).json({errors});
                   return;
               }

               const params = [firstName, lastName, displayName, email, '', hashedPassword];
               console.log(params);

               db.run(sqlStatements.insertUser, params, async (err) => {
                   if (err) {
                       errors.push(`Failed to create user`);
                       res.status(400).json({errors});
                       return;
                   }

                   // Log the user in.
                   try {
                       const user = await getUserByEmail(db, email);
                       delete user.password;

                       const userIpAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

                       try {
                           const token = await tokens.createToken(db, user.id, req.headers['user-agent'], userIpAddress);

                           res.status(200).json({
                               "tokenInfo": token,
                               user
                           });
                       } catch (error) {
                           res.status(500).json({
                               'error': error.toString()
                           });
                       }
                   } catch(error) {
                       if (err) {
                           errors.push(`Could not load user after creating it`);
                           res.status(400).json({errors});
                       }
                   }
               });
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

        if (!req.files || Object.keys(req.files).length === 0) {
            errors.push('No files were uploaded');
            return res.status(400).json({errors});
        }

        const mediaService = mediaModule.getMediaService(config);

        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        const profilePhotoFile = req.files.profilePhoto;
        console.log('Mime type is: ', profilePhotoFile.mimetype);

        const extension = mediaService.getImageExtension(profilePhotoFile);
        if (extension === '') {
            errors.push('Invalid file type');
            return res.status(400).json({errors});
        }

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

        // Use the mv() method to place the file somewhere on your server
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
                db.run(sqlStatements.updateUserPhoto, [uploadUrl, token.userId], (err) => {
                    if (err) {
                        errors.push(err.toString());
                        return res.status(500).json({errors});
                    }

                    return res.send({
                        "success": true,
                        "imageUrl": uploadUrl,
                    });
                });
            } catch (err) {
                errors.push('Failed to move resize photo: ' + err.toString());
                return res.status(500).json({errors});
            }
        });
    }
}

const getUserByEmail = (db, email, exceptionIfNotExisting = true) => {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare(sqlStatements.getUserByEmail);
        if (!stmt) {
            reject('getUserByEmail::Failed to prepare statement');
            return;
        }

        stmt.get(email, (err, user) => {
            // If there was a query error - handle it.
            if (err) {
                reject(err);
                return;
            }

            // If no matching user was found, return a login failure message.
            if (!user) {
                if (exceptionIfNotExisting) {
                    reject(`could not find user with email ${email}`);
                    return;
                } else {
                    resolve(null);
                    return;
                }
            }

            resolve(user);
        });
    });
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