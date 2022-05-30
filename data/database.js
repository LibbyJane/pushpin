const sqlite3 = require('sqlite3').verbose();

let db = null;

const getDb = function() {
    if (db == null) {
        db = new sqlite3.Database('pushpin.db');
    }

    return db;
};

const DbManager = {
    /**
     * Executes an SQL statement with the given parameter.
     * @param {string} sql
     * @param {array} params
     * @returns {Promise<unknown>}
     */
    execute: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            const conn = getDb();

            conn.run(sql, params, (err) => {
                if (err) {
                    reject(err);
                }

                resolve();
            });
        });
    },
    /**
     * Returns a single row using an SQL statement with the given parameters.
     * @param {string} sql
     * @param {array} params
     * @returns {Promise<unknown>}
     */
    getRow: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            const conn = getDb();

            conn.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                }

                if (!row) {
                    resolve(null);
                }

                resolve(row);
            });
        });
    },
    /**
     * Prepares the SQL statement for later execution.
     * @param {sting} sql
     * @param {array|null} params
     * @returns {Statement}
     */
    prepare: (sql, params = null) => {
        const conn = getDb();
        return conn.prepare(sql, params);
    }
}

module.exports.dbManager = DbManager;