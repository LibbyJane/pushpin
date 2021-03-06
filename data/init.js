const bcrypt = require("bcrypt");
const { stat } = require("fs");

const init = (db, callback) => {
    createTables(db, () => {
        resetAllTables(db, () => {
            insertSampleUsers(db, () => {
                insertSampleNotes(db, () => {
                    insertSampleRecipients(db, () => {
                        console.log('Database setup completed');
                        callback();
                    });
                });
            });
        })
    });

    function createTables(db, callback) {
        const createUserTableSql = `
            CREATE TABLE IF NOT EXISTS users(
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                firstName VARCHAR(50) NOT NULL,
                lastName VARCHAR(50) NOT NULL,
                displayName VARCHAR(50) NOT NULL,
                email VARCHAR(255) NOT NULL,
                password VARCHAR(80) NOT NULL,
                uid VARCHAR(80) NOT NULL,
                imageURL VARCHAR(80)
            );
        `;

        const createNotesTableSql = `
            CREATE TABLE IF NOT EXISTS notes(
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                createdByID INTEGER NOT NULL,
                message VARCHAR(255),
                imageURL VARCHAR(80),
                style VARCHAR(50),
                color VARCHAR(20)
            );
        `;

        const createRecipientsTableSql = `
            CREATE TABLE IF NOT EXISTS recipients(
                noteId INTEGER NOT NULL,
                recipientId INTEGER NOT NULL,
                status VARCHAR(50),
                reaction VARCHAR(50),
                reactionUpdatedAt INTEGER,
                PRIMARY KEY (noteId, recipientId)
        );
        `;

        const createTokensTableSql = `
            CREATE TABLE IF NOT EXISTS tokens(
                id VARCHAR(36) PRIMARY KEY NOT NULL,
                userId INTEGER NOT NULL,
                createdAt INTEGER NOT NULL,
                expiresAt INTEGER NOT NULL,
                userAgent TEXT NOT NULL,
                ipAddress VARCHAR(255) NOT NULL
        );
        `;

        const sqlStatements = [
            {
                "name": "Create user table",
                "sql": createUserTableSql,
            },
            {
                "name": "Create note table",
                "sql": createNotesTableSql,
            },
            {
                "name": "Create recipients table",
                "sql": createRecipientsTableSql,
            },
            {
                "name": "Applying recipients table user index",
                "sql": `CREATE INDEX IF NOT EXISTS idx_note_recipients_user_id ON recipients(recipientId);`,
            },
            {
                "name": "Creating tokens table",
                "sql": createTokensTableSql,
            },
        ];

        const applyNextSqlStatement = (db, index, callback) => {
            const statementInfo = sqlStatements[index];
            console.log("Running: " + statementInfo.name);

            db.run(statementInfo.sql, [], (err) => {
                if (err) {
                    console.log("Caught error: ", err);
                } else {
                    if (index < (sqlStatements.length - 1)) {
                        applyNextSqlStatement(db, ++index, callback);
                    } else {
                        console.log("Table setup completed");
                        callback();
                    }
                }
            });
        }

        applyNextSqlStatement(db, 0, callback);
    }

    function resetAllTables(db, callback) {
        const tables = ['recipients', 'notes', 'tokens', 'users'];

        const emptyNextTable = (db, tableIndex, callback) => {
            const tableName = tables[tableIndex];

            console.log('Deleting data from table ', tableName);
            const sql = "DELETE FROM " + tableName;

            db.run(sql, (err) => {
                if (err) {
                    console.log('Failed to run delete query:', sql);
                    return;
                }

                if (tableIndex < (tables.length - 1)) {
                    emptyNextTable(db, ++tableIndex, callback);
                } else {
                    console.log('Resetting all autoincrement sequence numbers');
                    const resetSql = `UPDATE sqlite_sequence SET seq = 0;`

                    db.run(resetSql, (err) => {
                        if (err) {
                            console.log('Failed to run reset sequences query:', resetSql);
                            return;
                        } else {
                            callback();
                        }
                    });
                }
            });
        }

        emptyNextTable(db, 0, callback);
    }

    function insertSampleUsers(db, callback) {

        const users = [
            {
                'firstName': 'Cookie',
                'lastName': 'Monster',
                'displayName': 'Cookie',
                'email': 'cookie@monster.com',
                'password': 'testtest',
                'imageURL': 'https://firebasestorage.googleapis.com/v0/b/thedojo-d76cf.appspot.com/o/thumbnails%2FnOPT6hmpG8TQE6a1CrqVqAKvbeX2%2Fcookiemonster.jpg?alt=media&token=e4bb4797-e209-4441-bd83-0e2a09b33ad7',
                'uid': '2XM5vxnZGhSqqs5AnEMTLbUxcCm2'
            },
            {
                'firstName': 'Animal',
                'lastName': 'Monster',
                'displayName': 'Animaaaaaaal',
                'email': 'animal@muppets.com',
                'password': 'testtest',
                'imageURL': 'https://firebasestorage.googleapis.com/v0/b/thedojo-d76cf.appspot.com/o/thumbnails%2F2XM5vxnZGhSqqs5AnEMTLbUxcCm2%2Fanimal.jpg?alt=media&token=96ac0cf7-78c0-41fa-a096-5b79de53aeaf',
                'uid': '2XM5vxnZGhSqqs5AnEMTLbUxcCm2'
            },
            {
                'firstName': 'Libby',
                'lastName': 'Chapman',
                'displayName': 'Dizski',
                'email': 'libby@libbychapman.com',
                'password': 'bingle',
                'imageURL': 'https://firebasestorage.googleapis.com/v0/b/thedojo-d76cf.appspot.com/o/thumbnails%2FnOPT6hmpG8TQE6a1CrqVqAKvbeX2%2Fcookiemonster.jpg?alt=media&token=e4bb4797-e209-4441-bd83-0e2a09b33ad7',
                'uid': '2XM5vxnZGhSqqs5AnEMTLbUxcCm2'
            },
            {
                'firstName': 'Andy',
                'lastName': 'Chapman',
                'displayName': 'Nycran',
                'email': 'andy@andychapman.net',
                'password': 'mango77z',
                'imageURL': 'https://firebasestorage.googleapis.com/v0/b/thedojo-d76cf.appspot.com/o/thumbnails%2FnOPT6hmpG8TQE6a1CrqVqAKvbeX2%2Fcookiemonster.jpg?alt=media&token=e4bb4797-e209-4441-bd83-0e2a09b33ad7',
                'uid': '2XM5vxnZGhSqqs5AnEMTLbUxcCm2'
            },
        ];

        const saltRounds = 10;

        const createUserSql = `
                INSERT INTO users(firstName, lastName, displayName, email, password, imageURL, uid)
                VALUES (?, ?, ?, ?, ?, ?, ?);
            `

        const stmt = db.prepare(createUserSql);

        const insertNextUser = function (currentUserNo) {
            const user = users[currentUserNo];

            bcrypt.hash(user.password, saltRounds, function (err, hashedPassword) {
                stmt.run(user.firstName, user.lastName, user.displayName, user.email, hashedPassword, user.imageURL, user.uid);

                if (currentUserNo < (users.length - 1)) {
                    insertNextUser(++currentUserNo, callback);
                } else {
                    stmt.finalize();
                    console.log('USERS INSERTED');
                    callback();
                }
            });
        }

        insertNextUser(0);
    }

    function insertSampleNotes(db, callback) {
        const notes = [
            {
                'createdByID': 1,
                'message': 'Hello Cookie',
                'imageURL': 'https://firebasestorage.googleapis.com/v0/b/thedojo-d76cf.appspot.com/o/noteImages%2F2XM5vxnZGhSqqs5AnEMTLbUxcCm2%2Fshortbreadcookies.jpg?alt=media&token=1e8470ee-bdf3-4c98-83fa-9383b6466981',
                'style': 'polaroid',
                'color': 'var(--note-yellow)'
            },
            {
                'createdByID': 2,
                'message': 'Mmm cookie',
                'imageURL': 'https://firebasestorage.googleapis.com/v0/b/thedojo-d76cf.appspot.com/o/thumbnails%2F2XM5vxnZGhSqqs5AnEMTLbUxcCm2%2Fanimal.jpg?alt=media&token=96ac0cf7-78c0-41fa-a096-5b79de53aeaf',
                'style': 'postcard'
            },
            {
                'createdByID': 3,
                'message': 'Nothing to see here',
                'imageURL': null,
                'style': 'stickynote',
                'color': 'var(--note-pink)'
            },
        ];

        const createNoteSql = `
                INSERT INTO notes(createdByID, message, imageURL, style, color)
                VALUES (?, ?, ?, ?, ?);
            `

        const stmt = db.prepare(createNoteSql);

        const insertNext = function (current) {
            const note = notes[current];
            stmt.run(note.createdByID, note.message, note.imageURL, note.style);

            if (current < (notes.length - 1)) {
                insertNext(++current, callback);
            } else {
                stmt.finalize();
                console.log('NOTES INSERTED');
                callback();
            }
        }

        insertNext(0);
    }

    function insertSampleRecipients(db, callback) {
        const recipients = [
            {
                'noteId': 1,
                'recipientId': 1,
                'status': 'saved'
            },
            {
                'noteId': 1,
                'recipientId': 2,
                'status': 'deleted'
            },
            {
                'noteId': 2,
                'recipientId': 2,
                'status': 'saved'
            },
            {
                'noteId': 2,
                'recipientId': 3,
                'status': 'saved'
            },
            {
                'noteId': 3,
                'recipientId': 2,
                'status': 'saved'
            },
        ];

        const createRecipientsSql = `
                INSERT INTO recipients(noteId, recipientId, status)
                VALUES (?, ?, ?);
            `

        const stmt = db.prepare(createRecipientsSql);

        const insertNext = function (current) {
            const recipient = recipients[current];
            stmt.run(recipient.noteId, recipient.recipientId, recipient.status);

            if (current < (recipients.length - 1)) {
                insertNext(++current, callback);
            } else {
                stmt.finalize();
                console.log('RECIPIENTS INSERTED');
                callback();
            }
        }

        insertNext(0);
    }
}

module.exports.initialiseDatabase = init;