const sqlite3 = require('sqlite3').verbose();
const environment = require('./environment');
const path = require('node:path');
const fs = require('fs');
const migrate = require('migrate');

let db = null;

const getDb = function() {
    if (db == null) {
        const dbName = getDbName();
        db = new sqlite3.Database(dbName);
    }

    return db;
};

const getDbName = function() {
    return environment.isUnderTest() ? "pushpin_test.db" : "pushpin.db";
}

const getMigrationsStoreName = function() {
    return environment.isUnderTest() ? ".migrate_test" : ".migrate";
}

const DbManager = {
    deleteDb: () => {
        return new Promise(async (resolve, reject) => {
            if (!environment.isUnderTest()) {
                throw Error('You may only delete the database in a testing environment');
            }

            const dbPath = __dirname + path.sep + getDbName();
            if (fs.existsSync(dbPath)) {
                await fs.rm(dbPath, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    },
    deleteMigrationStoreFile: () => {
        return new Promise(async (resolve, reject) => {
            if (!environment.isUnderTest()) {
                throw Error('You may only delete the database migration store file in a testing environment');
            }

            const dbPath = __dirname + path.sep + getMigrationsStoreName();
            if (fs.existsSync(dbPath)) {
                await fs.rm(dbPath, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    },
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
     * Returns all row using an SQL statement with the given parameters.
     * @param {string} sql
     * @param {array} params
     * @returns {Promise<unknown>}
     */
    getAll: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            const conn = getDb();

            conn.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                }

                if (!rows) {
                    resolve([]);
                }

                resolve(rows);
            });
        });
    },
    migrate: () => {
        return new Promise((resolve, reject) => {
            migrate.load({
                stateStore: getMigrationsStoreName()
            }, function (err, set) {
                if (err) {
                    reject(err)
                } else {
                    set.up(function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    })
                }
            });
        });
    },
    /**
     * Prepares the SQL statement for later execution.
     * @param {string} sql
     * @param {array|null} params
     * @returns {Statement}
     */
    prepare: (sql, params = null) => {
        const conn = getDb();
        return conn.prepare(sql, params);
    }
}

module.exports.dbManager = DbManager;