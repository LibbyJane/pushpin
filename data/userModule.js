const bcrypt = require("bcrypt");
const tokens = require("./tokens");
const validationModule = require("./validationModule");

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

        try {
            // Make sure the user doesn't already exist in the system.
            const user = await getUserByEmail(db, email);

            if (user) {
                errors.push(`This email address is already registered with us`);
                res.status(400).json({errors});
                return;
            }

            // Insert the user into the database

            // Login the user in

            // return the token info
        } catch (error) {
            errors.push(error.toString());
            res.status(400).json({errors});
        }
    }
}

const getUserByEmail = (db, email) => {
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
                reject(`could not find user with email ${email}`);
                return;
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
    `
}