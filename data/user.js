const bcrypt = require("bcrypt");
const tokens = require("./tokens");

module.exports.login = (db) => {
    return async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;

        const sql = `
    SELECT id, firstName, lastName, displayName, imageURL, email, password
    FROM users
    WHERE email = ?
    `

        const stmt = db.prepare(sql);

        stmt.get(email, (err, user) => {
            // If there was a query error - handle it.
            if (err) {
                res.status(500).json({
                    'error': err.toString()
                });
                return;
            }

            // If no matching user was found, return a login failure message.
            if (!user) {
                res.status(400).json({
                    'error': 'Login failed'
                });
                return;
            }

            bcrypt.compare(password, user.password, async (err, success) => {
                if (err) {
                    res.status(500).json({
                        'error': err.toString()
                    });
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
        });
    }
}