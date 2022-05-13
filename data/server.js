const https = require("https");
const fs = require("fs");
const express = require('express')
const bcrypt = require("bcrypt");
var cors = require('cors')

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('pushpin.db');

// mkcert -key-file key.pem -cert-file cert.pem localhost
const keyFile = '../key.pem';
const certFile = '../cert.pem';
const sslOptions = {
    key: fs.readFileSync(keyFile,),
    cert: fs.readFileSync(certFile),
};
const port = 4000


const init = () => {
    createTables(db, () => {
        insertSampleUsers(db, () => {
            insertSampleNotes(db, () => {
                insertSampleRecipients(db, () => {

                });
            });
        });
    });
}

init();
const app = express()
    .use(express.json())
    .use(cors());
const server = https.createServer(sslOptions);

server
    .on('request', app)
    .listen(port, () => {
        console.log(
            `Go to https://localhost:${port}/`
        );
    });


// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// });

app.get('/', async (req, res) => {
    const query = `
    SELECT id, firstName, lastName, displayName, email
    FROM users
    WHERE (firstName like '%cha%' OR lastName LIKE '%cha%' or email LIKE '%cha%')
    `;
    const users = [];
    await db.each(query, (err, row) => {
        users.push(row);
    }, () => {
        res.status(200).json(users)
    });
});

app.post('/notes', async (req, res) => {
    //console.log('get notes', req);
    const uid = req.body.id;
    const query = `
    SELECT n.*
    FROM notes n
    INNER JOIN recipients r ON n.id = r.note_id
    WHERE r.recipient_id = ?
    `;
    const notes = [];
    await db.each(query, [uid], (err, row) => {
        notes.push(row);
    }, () => {
        res.status(200).json(notes)
    });
});

app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const sql = `
    SELECT id, firstName, lastName, displayName, imageURL, email, password
    FROM users
    WHERE email = ?
    `

    const stmt = db.prepare(sql);

    stmt.get(email, (err, user) => {
        // If there was a query error - handle it.
        if (err) {
            res.status(500).json({
                'error': err.toString()
            });
            return;
        }

        // If no matching user was found, return a login failure message.
        if (!user) {
            res.status(400).json({
                'error': 'Login failed'
            });
            return;
        }

        // Check the password is correct.
        const saltRounds = 10;

        bcrypt.compare(password, user.password, function (err, success) {
            if (err) {
                res.status(500).json({
                    'error': err.toString()
                });
            }

            if (success) {
                delete user.password;
                res.status(200).json({
                    'session_id': "12345",
                    user: user
                });
            } else {
                res.status(400).json({
                    'error': 'Login failed'
                });
            }
        });
    });
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
        style VARCHAR(50)
    );
    `;

    const createRecipientsTableSql = `
    CREATE TABLE IF NOT EXISTS recipients(
        note_id INTEGER NOT NULL,
        recipient_id INTEGER NOT NULL,
        status VARCHAR(50),
        PRIMARY KEY (note_id, recipient_id )
    );
    `;


    db.run(createUserTableSql, [], () => {
        db.run(createNotesTableSql, [], () => {
            db.run(createRecipientsTableSql, [], () => {
                db.run(`CREATE INDEX idx_note_recipients_user_id ON recipients(recipient_id);`, [], callback);
            });
        });
    });
}

function insertSampleUsers(db, callback) {
    // Delete all existing users
    sql = "DELETE FROM users";
    db.run(sql);

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

    const bcrypt = require('bcrypt');
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
                callback();
            }
        });
    }

    insertNextUser(0);
}

function insertSampleNotes(db, callback) {
    // Delete all existing users
    sql = "DELETE FROM notes";
    db.run(sql);

    const notes = [
        {
            'createdByID': 1,
            'message': 'Hello Cookie',
            'imageURL': 'https://firebasestorage.googleapis.com/v0/b/thedojo-d76cf.appspot.com/o/noteImages%2F2XM5vxnZGhSqqs5AnEMTLbUxcCm2%2Fshortbreadcookies.jpg?alt=media&token=1e8470ee-bdf3-4c98-83fa-9383b6466981',
            'style': 'polaroid'
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
            'style': 'stickynote'
        },
    ];

    const createNoteSql = `
    INSERT INTO notes(createdByID, message, imageURL, style)
    VALUES (?, ?, ?, ?);
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
    // Delete all existing recipients
    sql = "DELETE FROM recipients";
    db.run(sql);

    const recipients = [
        {
            'note_id': 1,
            'recipient_id': 1,
            'status': 'saved'
        },
        {
            'note_id': 1,
            'recipient_id': 2,
            'status': 'deleted'
        },
        {
            'note_id': 2,
            'recipient_id': 2,
            'status': 'saved'
        },
        {
            'note_id': 2,
            'recipient_id': 3,
            'status': 'saved'
        },
        {
            'note_id': 3,
            'recipient_id': 2,
            'status': 'saved'
        },
    ];

    const createRecipientsSql = `
    INSERT INTO recipients(note_id, recipient_id, status)
    VALUES (?, ?, ?);
    `
    const stmt = db.prepare(createRecipientsSql);

    const insertNext = function (current) {
        const recipient = recipients[current];
        stmt.run(recipient.note_id, recipient.recipient_id, recipient.status);

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
