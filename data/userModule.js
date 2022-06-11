const bcrypt = require("bcrypt");
const tokens = require("./tokens");
const validationModule = require("./validationModule");
const mediaModule = require('./mediaModule');
const database = require('./database');
const userRegistrationService = require('./modules/users/services/userRegistrationService');
const uuid = require('uuid');

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
            return res.status(400).json({ errors });
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
                return res.status(500).json({ errors });
            }
        });
    }
}

/**
 * Creates a new invitation for the logged in user
 * @returns {(function(*, *): Promise<*|undefined>)|*}
 */
module.exports.createInvitation = () => {
    return async (req, res) => {
        let errors = [];
        const token = req.token;

        if (!token) {
            errors.push('no token found');
            return res.status(500).json({ errors });
        }

        // Insert a new the invitation for the logged-in user.
        const invitationCode = uuid.v4();
        const createdAt = Math.floor((new Date().getTime()) / 1000);

        // An invitation will expire after 30 days
        const expiresAt = createdAt + (86_400 * 30);

        const params = [invitationCode, token.userId, createdAt, expiresAt];

        try {
            const databaseManager = database.dbManager;
            await databaseManager.execute(sqlStatements.insertInvitation, params);

            return res.send({
                "success": true,
                "code": invitationCode,
            });
        } catch (err) {
            errors.push('Failed to create a new invitation for the logged in user: ' + err.toString());
            return res.status(500).json({ errors });
        }
    }
}

/**
 * Gets the details of the user who sent an invitation.
 */
module.exports.getUserWhoSentInvite = () => {
    return async (req, res) => {
        let errors = [];

        // The inviteCode must be provided in the URL, and it MUST not be empty.
        const inviteCode = req.params.code;

        errors = validationModule.allStringsInArrayAreNotEmpty([
            {
                "name": "code",
                "value": inviteCode,
            },
        ]);

        if (errors.length !== 0) {
            res.status(400).json({ errors });
            return;
        }

        try {
            const databaseManager = database.dbManager;

            // Load the details of the invitation.
            const invite = await databaseManager.getRow(sqlStatements.getInviteByCode, [inviteCode]);

            if (!invite) {
                errors.push('Failed to find invitation.  Invitation code may be incorrect, or the invitation may have expired.');
                return res.status(400).json({ errors });
            }

            // Load the user associated with the invitation
            const user = await databaseManager.getRow(sqlStatements.getUserById, [invite.userId]);

            if (!user) {
                errors.push('Failed to user associated with invitation.  This should not happen.');
                return res.status(500).json({ errors });
            }

            return res.send(user);
        } catch (err) {
            errors.push('Failed to load the user who created the invitation: ' + err.toString());
            return res.status(500).json({ errors });
        }
    }
}

/**
 * Accepts an invitation and adds the user who sent the invitation as a friend.
 * Note, the invitation code must be sent in the URL.
 */
module.exports.acceptInvitation = () => {
    return async (req, res) => {
        let errors = [];

        // The user MUST be logged in.
        const token = req.token;

        if (!token) {
            errors.push('no token found');
            return res.status(500).json({ errors });
        }

        // The inviteCode must be provided in the URL, and it MUST not be empty.
        const inviteCode = req.params.code;

        errors = validationModule.allStringsInArrayAreNotEmpty([
            {
                "name": "code",
                "value": inviteCode,
            },
        ]);

        if (errors.length !== 0) {
            res.status(400).json({ errors });
            return;
        }

        try {
            const databaseManager = database.dbManager;

            // Load the details of the invitation.
            const invite = await databaseManager.getRow(sqlStatements.getInviteByCode, [inviteCode]);

            if (!invite) {
                errors.push('Failed to find invitation.  Invitation code may be incorrect, or the invitation may have expired.');
                return res.status(400).json({ errors });
            }

            // Load the user associated with the invitation
            const user = await databaseManager.getRow(sqlStatements.getUserById, [invite.userId]);

            if (!user) {
                errors.push('Failed to user associated with invitation.  This should not happen.');
                return res.status(500).json({ errors });
            }

            const userId1 = getLowerUserId(token.userId, user.id);
            const userId2 = getHigherUserId(token.userId, user.id);

            // Make sure the friendship doesn't already exist.
            const friendship = await databaseManager.getRow(sqlStatements.getExistingFriendship, [userId1, userId2]);

            if (friendship) {
                errors.push('A friendship already exists between these users.');
                return res.status(500).json({ errors });
            }

            // Insert the friendship
            const createdAt = Math.floor((new Date().getTime()) / 1000);
            await databaseManager.getRow(sqlStatements.insertFriendship, [userId1, userId2, createdAt]);

            // All done.
            return res.send({
                "success": true,
            });
        } catch (err) {
            errors.push('Failed to load the user who created the invitation: ' + err.toString());
            return res.status(500).json({ errors });
        }
    }
}

module.exports.getFriendsForLoggedInUser = () => {
    return async (req, res) => {
        const errors = [];

        const token = req.token;
        if (!token) {
            errors.push('no token found');
            return res.status(500).json({ errors });
        }

        try {
            const databaseManager = database.dbManager;

            // Get the friends for the logged in user.
            const friends = await databaseManager.getAll(sqlStatements.getFriends, [token.userId, token.userId]);

            // All done.
            return res.send(friends);
        } catch (err) {
            errors.push('Failed to load friends: ' + err.toString());
            return res.status(500).json({ errors });
        }
    }
};

/**
 * Gets the lower of the two userIds
 * @param {number} userId1
 * @param {number} userId2
 * @returns {*}
 */
const getLowerUserId = (userId1, userId2) => {
    if (userId1 < userId2) {
        return userId1;
    }

    return userId2;
}

/**
 * Gets the highest of the two userIds
 * @param {number} userId1
 * @param {number} userId2
 * @returns {*}
 */
const getHigherUserId = (userId1, userId2) => {
    if (userId1 > userId2) {
        return userId1;
    }

    return userId2;
}

/***
 * Finds a user with a matching email address and returns it.
 * @param databaseManager
 * @param email
 * @param exceptionIfNotExisting
 * @returns {Promise<null|object>}
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

/***
 * Finds a user with a matching email address and returns it.
 * @param databaseManager
 * @param {int} userId
 * @param exceptionIfNotExisting
 * @returns {Promise<null|object>}
 */
const getUserById = async (databaseManager, userId, exceptionIfNotExisting = true) => {
    const user = await databaseManager.getRow(sqlStatements.getUserById, [userId]);

    // If no matching user was found, return a login failure message.
    if (!user) {
        if (exceptionIfNotExisting) {
            throw new Error(`could not find user with id ${userId}`);
        }
    }

    return user;
}

const sqlStatements = {
    getExistingFriendship: `
    SELECT userId1, userId2, createdAt
    FROM friends
    WHERE userId1 = ?
    AND userId2 = ?
    `,
    getFriends: `
    SELECT id, firstName, lastName, displayName, imageURL
    FROM users
    WHERE id IN (
        SELECT userId2
        FROM friends
        WHERE userId1 = ?
        
        UNION
        
        SELECT userId1
        FROM friends
        WHERE userId2 = ?        
    )
    `,
    getInviteByCode: `
    SELECT userId, createdAt, expiresAt
    FROM invitations
    WHERE code = ?
    AND expiresAt > strftime('%s', 'now')
    `,
    getUserByEmail: `
    SELECT id, firstName, lastName, displayName, imageURL, email, password
    FROM users
    WHERE email = ?
    `,
    getUserById: `
    SELECT id, firstName, lastName, displayName, imageURL
    FROM users
    WHERE id = ?
    `,
    insertFriendship: `
    INSERT INTO friends(userId1, userId2, createdAt)
    VALUES(?, ?, ?);
    `,
    insertInvitation: `
    INSERT INTO invitations(code, userId, createdAt, expiresAt)
    VALUES(?, ?, ?, ?);
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