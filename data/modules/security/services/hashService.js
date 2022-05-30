const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports.verifyPassword = (plainTextPassword, hashedPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainTextPassword, hashedPassword, async (err, success) => {
            if (err) {
                reject(err.toString());
            } else {
                resolve(success);
            }
        });
    });
}

module.exports.hash = (plainTextPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(plainTextPassword, saltRounds, async (err, hashedPassword) => {
            if (err) {
                reject(err.toString());
            } else {
                resolve(hashedPassword);
            }
        });
    });
}

