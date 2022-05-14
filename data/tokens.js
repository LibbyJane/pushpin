const uuid = require('uuid');

/**
 * Creates a new token for the given userId.  You must also pass in the the userAgent and user IP address.
 * @param db
 * @param {number} userId
 * @param {string} userAgent
 * @param {string} ipAddress
 * @returns {Promise<unknown>}
 */
const createToken = async (db, userId, userAgent, ipAddress) => {
    const createdAt = new Date().getTime();
    const expiresAt = createdAt + (86400 * 90); // Token will expire after 90 days
    const token = uuid.v4();

    const queryPromise = new Promise(function(resolve, reject) {
        db.run(sqlStatements.insert, [token, userId, createdAt, expiresAt, userAgent, ipAddress], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    token,
                    createdAt,
                    expiresAt
                });
            }
        });
    });

    return queryPromise;
}

/**
 * Gets the given token from the database.  Note, if the userAgent doesn't match,
 * the token will not be returned.
 * @param db
 * @param {string} tokenId
 * @param {string} userAgent
 * @param {string} ipAddress
 * @returns {Promise<unknown>}
 */
const getToken = async (db, tokenId, userAgent, ipAddress) => {
    const queryPromise = new Promise(function(resolve, reject) {
        db.get(sqlStatements.getToken, [tokenId], (err, token) => {
            if (err) {
                reject(err);
            } else {
                if (!token) {
                    reject('Invalid token id');
                } else if (token.userAgent != userAgent) {
                    reject('Invalid token');
                } else {
                    resolve(token);
                }
            }
        });
    });

    return queryPromise;
}

/**
 * Deletes the given token out of the database
 * @param db
 * @param {string}tokenId
 * @returns {Promise<unknown>}
 */
const deleteToken = async (db, tokenId) => {
    const queryPromise = new Promise(function(resolve, reject) {
        db.run(sqlStatements.deleteToken, [tokenId], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });

    return queryPromise;
}


/**
 * Express Middleware function that looks for an authorization header and validates it.
 * If successful, the "token" object is written into the request object, so you can access it inside your
 * endpoint with req.token.
 * If not successful, a 403 response will be sent back to the client.
 * @param options
 * @returns {(function(*, *, *): Promise<void>)|*}
 */
module.exports.checkTokenMiddleware = function(options) {
    return async (req, res, next) => {
        // Check for a debug flag in the options - if debug is on, errors will be written to the console.
        const debugMode = options.debug || false;
        const accessDeniedErrorMessage = 'access denied';

        const debugPrint = (message) => {
            if (!debugMode) {
                return;
            }

            console.log(message);
        }

        // Make sure the database object is present in the options.
        if ((!options.db) || (typeof options.db !== 'object')) {
            debugPrint('No database object defined in options');
            res.send(500, 'Server error');
        }

        const db = options.db;

        // Get the authorization bearer token from the headers.
        // It should look like this: Bearer ba48b7d3-82a0-4a3b-9d0b-910bae2214ee
        const authorizationHeader = req.headers['authorization'];

        if ((!authorizationHeader) || (typeof authorizationHeader !== 'string') || (authorizationHeader.length <40)) {
            debugPrint("No authorization header found. It should be in format Authorization: Bearer ba48b7d3-82a0-4a3b-9d0b-910bae2214ee");
            res.status(403).json({
                'error': accessDeniedErrorMessage
            });
            return;
        }

        // Split the token into it's elements "Bearer" and "Token"
        const headerElements = authorizationHeader.split(' ');
        if (headerElements.length !== 2) {
            debugPrint("Authorization header invalid. It should be in format Authorization: Bearer ba48b7d3-82a0-4a3b-9d0b-910bae2214ee");
            res.status(403).json({
                'error': accessDeniedErrorMessage
            });
            return;
        }

        const authorizationPrefix = headerElements[0];
        const tokenId = headerElements[1];

        if (authorizationPrefix !== 'Bearer') {
            debugPrint("Authorization header invalid. 'Bearer' prefix is wrong.  Header should be in format Authorization: Bearer ba48b7d3-82a0-4a3b-9d0b-910bae2214ee");
            res.status(403).json({
                'error': accessDeniedErrorMessage
            });
            return;
        }

        // A tokenId is a UUID V4 which should be exactly 36 characters long
        if (tokenId.length !== 36) {
            debugPrint("Authorization header invalid. 'UUID' length is incorrect.  Header should be in format Authorization: Bearer ba48b7d3-82a0-4a3b-9d0b-910bae2214ee");
            res.status(403).json({
                'error': accessDeniedErrorMessage
            });
            return;
        }

        const userAgent = req.headers['user-agent'];
        const userIpAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        try {
            const token = await getToken(db, tokenId, userAgent, userIpAddress);
            if (!token) {
                res.status(403).json({
                    'error': 'access denied'
                });

                return;
            }

            // Ensure the token hasn't expired.
            const now = new Date().getTime();
            if (token.expiresAt <= now) {
                try {
                    await deleteToken(db, token.id);
                } catch (error) {
                    debugPrint("Error deleting token: ", error);
                }

                res.status(403).json({
                    'error': 'access denied'
                });

                return;
            }

            // Note, we could also verify that the IP address matches the token.
            // That said, it's usually a bad idea because on mobile networks, IP addresses change
            // frequently.

            req.token = token;

            next();
        } catch (error) {
            res.status(403).json({
                'error': 'access denied'
            });
        }
    }
}

const sqlStatements = {
    insert: `
        INSERT INTO tokens (id, userId, createdAt, expiresAt, userAgent, ipAddress)
        VALUES (?, ?, ?, ?, ?, ?);
    `,
    getToken: `
        SELECT id, userId, createdAt, expiresAt, userAgent, ipAddress
        FROM tokens
        WHERE id = ?;
    `,
    deleteToken: `
        DELETE
        FROM tokens
        WHERE id = ?;
    `
}

module.exports.createToken = createToken;
module.exports.getToken = getToken;
module.exports.deleteToken = deleteToken;