const https = require("https");
const fs = require("fs");
const express = require('express')
const bcrypt = require("bcrypt");
const cors = require('cors');
const fileUpload = require('express-fileupload');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('pushpin.db');

// Config
const config = require('./config.json');
console.log(config);

// Our modules
const init = require('./init');
const tokens = require('./tokens');
const userModule = require('./userModule');

const keyFile = '../key.pem';
const certFile = '../cert.pem';
const sslOptions = {
    key: fs.readFileSync(keyFile,),
    cert: fs.readFileSync(certFile),
};

// Switch to true to get extra diagnostics from endpoints.
const debugMode = true;

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

    const fileUploadParams = {
        limits: {
            fileSize: 20_000_000
        },
        useTempFiles : true,
        tempFileDir : config.files.tmpUploadPath,
        safeFileNames: true,
        preserveExtension: true,
    }

    const staticFilesOptions = {
        dotfiles: 'ignore',
        etag: true,
        index: false,
        fallthrough: true,
        maxAge: '1d',
        redirect: false,
        setHeaders: function (res, path, stat) {
            res.set('x-timestamp', Date.now())
        }
    }

    // Setup the server
    const app = express()
        .use(express.static('public', staticFilesOptions))
        .use(express.json())
        .use(cors())
        .use(fileUpload(fileUploadParams));


    const server = https.createServer(sslOptions);
    server
        .on('request', app)
        .listen(config.server.port, () => {
            let host = config.server.host;
            if ((config.server.port !== 80) && (config.server.port !== 443)) {
                host += `:${config.server.port}`;
            }

            console.log(`Server running at: ${host}`);
        });

    // Setup endpoints
    app.get('/', tokens.checkTokenMiddleware({"db": db, "debug": debugMode}), async (req, res) => {
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

    app.get('/notes', tokens.checkTokenMiddleware({"db": db, "debug": debugMode}), async (req, res) => {
        /**
         * If we get here then the middleware has already verified that the authorization header is present
         * and contains a valid token.  There will be a token object containing the logged in user id
         * in the request object.
         */
        const token = req.token;

        const query = `
    SELECT n.*
    FROM notes n
    INNER JOIN recipients r ON n.id = r.note_id
    WHERE r.recipient_id = ?
    `;
        const notes = [];
        await db.each(query, [req.token.userId], (err, row) => {
            notes.push(row);
        }, () => {
            res.status(200).json(notes)
        });
    });

    // User Login
    app.post('/login', userModule.login(db));

    // Register user
    app.post('/register', userModule.register(db));

    // Upload profile photo
    app.post(
        '/upload/profile_photo',
        tokens.checkTokenMiddleware({"db": db, "debug": debugMode}),
        userModule.uploadProfilePhoto(db, config)
    );

    // User Logout
    app.get('/logout', tokens.checkTokenMiddleware({"db": db, "debug": debugMode}), async (req, res) => {
        try {
            await tokens.deleteToken(db, req.token.id);

            res.status(200).json({
                'success': true
            });
        } catch (error) {
            res.status(500).json({
                'error': "Logout failed"
            });
        }
    });

    // Capture All 404 errors
    app.use(function (req,res,next){
        res.status(404).json({
            "error": "404 - Resource not found"
        });
    });
});
