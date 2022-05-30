'use strict'

const database = require('./../database');

module.exports.up = async (next) => {
  const dbManager = database.dbManager;

  let sql = `
    CREATE TABLE IF NOT EXISTS recipients(
        noteId INTEGER NOT NULL,
        recipientId INTEGER NOT NULL,
        status VARCHAR(50),
        reaction VARCHAR(50),
        reactionUpdatedAt INTEGER,
        PRIMARY KEY (noteId, recipientId),
        FOREIGN KEY (noteId) REFERENCES notes (id),
        FOREIGN KEY (recipientId) REFERENCES users (id)
    );`;

  await dbManager.execute(sql, []);

  sql = `CREATE INDEX IF NOT EXISTS idx_note_recipients_recipient_id ON recipients(recipientId);`
  await dbManager.execute(sql, []);

  sql = `CREATE INDEX IF NOT EXISTS idx_note_recipients_recipient_id_status ON recipients(recipientId, status);`
  await dbManager.execute(sql, []);

  next();
}

module.exports.down = async (next) => {
  const dbManager = database.dbManager;

  const sql = `DROP TABLE recipients;`;
  await dbManager.execute(sql, []);

  next();
}