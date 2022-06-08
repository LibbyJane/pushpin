const config = require("./config.json");
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('pushpin.db');
const databaseManager = require('./database');

const tokens = require("./tokens");
const notesModule = require("./notesModule");
const userModule = require("./userModule");

const fileUploadParams = {
    limits: {
        fileSize: 20_000_000
    },
    useTempFiles: true,
    tempFileDir: config.files.tmpUploadPath,
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
    .use(bodyParser.urlencoded({ extended: true }))
    .use(express.json())
    .use(cors())
    .use(fileUpload(fileUploadParams));


// Setup endpoints
app.get('/', tokens.checkTokenMiddleware({ "debug": config.debugMode }), async (req, res) => {
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

app.get('/users', tokens.checkTokenMiddleware({ "debug": config.debugMode }), async (req, res) => {
    const query = `
            SELECT id, firstName, lastName, displayName, email, imageURL
            FROM users
        `;
    const users = [];
    await db.each(query, (err, row) => {
        users.push(row);
    }, () => {
        res.status(200).json(users)
    });
});

// Get available notes for the logged in user
app.get('/notes', tokens.checkTokenMiddleware({ "debug": config.debugMode }), notesModule.getNotesForLoggedInUser(db));

// Gets any note reactions for the logged in user, where the reaction was recorded in the last <numDays> days
app.get('/note/reactions/:numDays', tokens.checkTokenMiddleware({ "debug": config.debugMode }), notesModule.getNotesReactionsForLoggedInUser(db));

// Insert/create a new note.
app.post('/note', tokens.checkTokenMiddleware({ "debug": config.debugMode }), notesModule.createNote(db, config));

// Updates a note with a photo - Note this is a 'patch' request.  Send through "notePhoto" as the file name.
app.patch('/upload/note_photo/:noteId', tokens.checkTokenMiddleware({ "debug": config.debugMode }), notesModule.uploadNotePhoto(db, config));

// Updates a note status with a provided status.
// This is a PATCH request.  Pass the noteId in the url, and send { "status": "saved" } in the JSON Payload.
app.patch('/note/update_status/:noteId', tokens.checkTokenMiddleware({ "debug": config.debugMode }), notesModule.updateNoteStatus(db));

// Updates a note reaction with a provided reaction string.
// This is a PATCH request.  Pass the noteId in the url, and send { "reaction": "loved" } in the JSON Payload.
app.patch('/note/update_reaction/:noteId', tokens.checkTokenMiddleware({ "debug": config.debugMode }), notesModule.updateNoteReaction(db));

// Create a new invitation for the logged in user.
app.post('/invite', tokens.checkTokenMiddleware({ "debug": config.debugMode }), userModule.createInvitation());

// Get the details of the user who sent an invite
app.get('/user/invite/:code', tokens.checkTokenMiddleware({ "debug": config.debugMode }), userModule.getUserWhoSentInvite());

// User Login
app.post('/login', userModule.login());

// Register user
app.post('/register', userModule.register());

// Upload profile photo
app.post(
    '/upload/profile_photo',
    tokens.checkTokenMiddleware({ "debug": config.debugMode }),
    userModule.uploadProfilePhoto(config)
);

// User Logout
app.get('/logout', tokens.checkTokenMiddleware({ "debug": config.debugMode }), async (req, res) => {
    try {
        await tokens.deleteToken(databaseManager.dbManager, req.token.id);

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
app.use(function (req, res, next) {
    res.status(404).json({
        "error": "404 - Resource not found"
    });
});

module.exports.app = app;
