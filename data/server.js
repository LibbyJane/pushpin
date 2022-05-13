const https = require("https");
const fs = require("fs");
const express = require('express')
const bcrypt = require("bcrypt");
const cors = require('cors');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('pushpin.db');

// Our modules
const init = require('./init');
const tokens = require('./tokens');

const keyFile = '../key.pem';
const certFile = '../cert.pem';
const sslOptions = {
    key: fs.readFileSync(keyFile,),
    cert: fs.readFileSync(certFile),
};
const port = 4000

const testCreateToken = async () => {
    try {
        await tokens.createToken(db, 1, "TestUserAgent", "127.0.0.1");
    } catch(error) {
        console.log('Caught error whilst trying to create token: ', error);
    }
};

// Set up the database.
init.initialiseDatabase(db, async () => {
    await testCreateToken();

    // Setup the server
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

    // Setup endpoints
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

            bcrypt.compare(password, user.password, async (err, success) => {
                if (err) {
                    res.status(500).json({
                        'error': err.toString()
                    });
                }

                if (success) {
                    delete user.password;

                    const userIpAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

                    try {
                        const token = await tokens.createToken(db, user.id, req.headers['user-agent'], userIpAddress);

                        res.status(200).json({
                            "tokenInfo": token,
                            user
                        });
                    } catch (error) {
                        res.status(500).json({
                            'error': error.toString()
                        });
                    }
                } else {
                    res.status(400).json({
                        'error': 'Login failed'
                    });
                }
            });
        });
    });
});
