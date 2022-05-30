'use strict'

const database = require('./../database');

module.exports.up = async (next) => {
  const dbManager = database.dbManager;

  let sql = `
    CREATE TABLE IF NOT EXISTS tokens(
        id VARCHAR(36) PRIMARY KEY NOT NULL,
        userId INTEGER NOT NULL,
        createdAt INTEGER NOT NULL,
        expiresAt INTEGER NOT NULL,
        userAgent TEXT NOT NULL,
        ipAddress VARCHAR(255) NOT NULL,
        FOREIGN KEY (userId) REFERENCES users (id)
    );`;

  await dbManager.execute(sql, []);

  next();
}

module.exports.down = async (next) => {
  const dbManager = database.dbManager;

  const sql = `DROP TABLE tokens;`;
  await dbManager.execute(sql, []);

  next();
}
