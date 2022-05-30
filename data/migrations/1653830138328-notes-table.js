'use strict'

const database = require('./../database');

module.exports.up = async (next) => {
  const dbManager = database.dbManager;

  let sql = `
    CREATE TABLE IF NOT EXISTS notes(
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        createdByID INTEGER NOT NULL,
        message VARCHAR(255),
        imageURL VARCHAR(80),
        style VARCHAR(50),
        color VARCHAR(20),
        FOREIGN KEY (createdByID) REFERENCES users (id)
    );`;

  await dbManager.execute(sql, []);

  sql = `CREATE INDEX IF NOT EXISTS idx_notes_created_by ON notes(createdByID);`
  await dbManager.execute(sql, []);

  next();
}

module.exports.down = async (next) => {
  const dbManager = database.dbManager;

  const sql = `DROP TABLE notes;`;
  await dbManager.execute(sql, []);

  next();
}