const fs = require("fs");

module.exports.fileHelper = {
    directoryExists: (path) => {
        return new Promise((resolve, reject) => {
            fs.access(path, (err) => {
                if (err && err.code === 'ENOENT') {
                    resolve(false);
                } else if (err) {
                    reject(err);
                }

                resolve(true);
            })
        });
    }
}
