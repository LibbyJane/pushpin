const request = require('supertest');
const appModule = require('./../../app');
const fixture = require('./../../modules/testing/fixture.json');

const app = appModule.app;

describe('Upload Note Photo Test', () => {
    it('Uploading a note photo will fail if no note photo is attached', async () => {
        const loginResult = await request(app)
            .post('/login')
            .set('User-Agent', "PushPinTestClient")
            .send({
                "email": fixture.users.mctest.email,
                "password": fixture.users.mctest.password,
            });

        expect(loginResult.statusCode).toBe(200)
        expect(loginResult.body).toHaveProperty('tokenInfo');
        const tokenInfo = loginResult.body.tokenInfo;

        // Create a note
        let res = await request(app)
            .post('/note')
            .set('User-Agent', "PushPinTestClient")
            .set('Authorization', `Bearer ${tokenInfo.token}`)
            .send({
                "style": fixture.notes.polaroid1.style,
                "message": fixture.notes.polaroid1.message,
                "recipientsList": fixture.notes.polaroid1.recipientsList,
            });

        expect(res.statusCode).toBe(200);
        const noteId = res.body.note.id;

        // Attempt to upload a note photo, but don't actually attach the note photo.
        res = await request(app)
            .patch(`/upload/note_photo/${noteId}`)
            .set('User-Agent', "PushPinTestClient")
            .set('Authorization', `Bearer ${tokenInfo.token}`)
            .send();

        expect(res.statusCode).toBe(400);
    });

    it('Uploading a note photo will succeed if a photo is attached', async () => {
        const loginResult = await request(app)
            .post('/login')
            .set('User-Agent', "PushPinTestClient")
            .send({
                "email": fixture.users.mctest.email,
                "password": fixture.users.mctest.password,
            });

        expect(loginResult.statusCode).toBe(200)
        expect(loginResult.body).toHaveProperty('tokenInfo');
        const tokenInfo = loginResult.body.tokenInfo;

        // Create a note
        let res = await request(app)
            .post('/note')
            .set('User-Agent', "PushPinTestClient")
            .set('Authorization', `Bearer ${tokenInfo.token}`)
            .send({
                "style": fixture.notes.polaroid1.style,
                "message": fixture.notes.polaroid1.message,
                "recipientsList": fixture.notes.polaroid1.recipientsList,
            });

        expect(res.statusCode).toBe(200);
        const noteId = res.body.note.id;

        // Attempt to upload a note photo, but don't actually attach the note photo.
        res = await request(app)
            .patch(`/upload/note_photo/${noteId}`)
            .set('User-Agent', "PushPinTestClient")
            .set('Authorization', `Bearer ${tokenInfo.token}`)
            .attach('notePhoto', 'resources/monkey.jpg');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body).toHaveProperty('imageUrl');
        expect(res.body.success).toBe(true);
        expect(res.body.imageUrl).toContain('http');
        expect(res.body.imageUrl).toContain('notes');

        // Also make sure that we can fetch the image from the returned image url.
        // Strip off the url prefix (https://localhost:4000/) because when running under a test
        // the server and port address may be different and we just want the URI of the image to fetch.
        const imageUrl = res.body.imageUrl;
        const uploadsPos = imageUrl.indexOf('uploads');
        const imageUri = "/" + imageUrl.substring(uploadsPos);

        res = await request(app)
            .get(imageUri);

        expect(res.statusCode).toBe(200);
        expect(res.headers['content-type'] ).toMatch( /image\/jpeg/ );
    });
});
