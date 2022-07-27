'use strict'

const database = require('./../database');

module.exports.up = async (next) => {
  const dbManager = database.dbManager;

  let sql = `
    CREATE TABLE IF NOT EXISTS friends(
        userId1 INTEGER NOT NULL,
        userId2 INTEGER NOT NULL,
        createdAt INTEGER NOT NULL,
        PRIMARY KEY (userId1, userId2),
        FOREIGN KEY (userId1) REFERENCES users (id),
        FOREIGN KEY (userId2) REFERENCES users (id)
    );`;

  await dbManager.execute(sql, []);

  next();
}

module.exports.down = async (next) => {
  const dbManager = database.dbManager;

  const sql = `DROP TABLE friends;`;
  await dbManager.execute(sql, []);

  next();
}
