'use strict'

const database = require('./../database');

module.exports.up = async (next) => {
  const dbManager = database.dbManager;

  let sql = `ALTER TABLE notes ADD COLUMN createdAt INT NOT NULL DEFAULT 0`;
  await dbManager.execute(sql, []);

  sql = `ALTER TABLE recipients ADD COLUMN createdAt INT NOT NULL DEFAULT 0`;
  await dbManager.execute(sql, []);

  sql = `CREATE INDEX IF NOT EXISTS idx_note_recipients_recipient_id_created_at ON recipients(recipientId, createdAt);`
  await dbManager.execute(sql, []);

  next();
}

module.exports.down = async (next) => {
  const dbManager = database.dbManager;

  let sql = `DROP INDEX idx_note_recipients_recipient_id_created_at;`;
  await dbManager.execute(sql, []);

  sql = `ALTER TABLE recipients DROP COLUMN createdAt;`;
  await dbManager.execute(sql, []);

  sql = `ALTER TABLE notes DROP COLUMN createdAt;`;
  await dbManager.execute(sql, []);

  next();
}