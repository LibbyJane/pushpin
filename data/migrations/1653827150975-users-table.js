'use strict'

const database = require('./../database');

module.exports.up = async (next) => {
  const dbManager = database.dbManager;

  let sql = `
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        firstName VARCHAR(50) NOT NULL,
        lastName VARCHAR(50) NOT NULL,
        displayName VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(80) NOT NULL,
        uid VARCHAR(80) NOT NULL,
        imageURL VARCHAR(80)
    );`;

  await dbManager.execute(sql, []);

  sql = `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`
  await dbManager.execute(sql, []);
  next();
}

module.exports.down = async (next) => {
  const dbManager = database.dbManager;

  const sql = `DROP TABLE users;`;
  await dbManager.execute(sql, []);

  next();
}
