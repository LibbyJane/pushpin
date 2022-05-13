const uuid = require('uuid');

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

const sqlStatements = {
    insert: `
        INSERT INTO tokens (id, userId, createdAt, expiresAt, userAgent, ipAddress)
        VALUES (?, ?, ?, ?, ?, ?);
    `
}

module.exports.createToken = createToken;