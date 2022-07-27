const request = require('supertest');
const appModule = require('./../../app');
const fixture = require('./../../modules/testing/fixture.json');

const app = appModule.app;

describe('User Search Test', () => {
    it('Search will succeed with a single search term', async () => {
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

        const searchResult = await request(app)
            .get('/user/search?query=mctest')
            .set('Authorization', `Bearer ${tokenInfo.token}`)
            .set('User-Agent', "PushPinTestClient")
            .send();

        expect(searchResult.statusCode).toBe(200);

        const results = searchResult.body;
        expect(Array.isArray(results)).toBeTruthy();
        expect(results.length).toBe(1);
    });

    it('Search will succeed with two search terms', async () => {
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

        const searchResult = await request(app)
            .get('/user/search?query=testy mctest')
            .set('Authorization', `Bearer ${tokenInfo.token}`)
            .set('User-Agent', "PushPinTestClient")
            .send();

        expect(searchResult.statusCode).toBe(200);

        const results = searchResult.body;
        expect(Array.isArray(results)).toBeTruthy();
        expect(results.length).toBe(1);
    });

    it('Search will return empty result with search term that does not match anyone', async () => {
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

        const searchResult = await request(app)
            .get('/user/search?query=arnie')
            .set('Authorization', `Bearer ${tokenInfo.token}`)
            .set('User-Agent', "PushPinTestClient")
            .send();

        expect(searchResult.statusCode).toBe(200);

        const results = searchResult.body;
        expect(Array.isArray(results)).toBeTruthy();
        expect(results.length).toBe(0);
    });

    it('Search will return empty result with two word search term that does not match anyone', async () => {
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

        const searchResult = await request(app)
            .get('/user/search?query=arnie mctest')
            .set('Authorization', `Bearer ${tokenInfo.token}`)
            .set('User-Agent', "PushPinTestClient")
            .send();

        expect(searchResult.statusCode).toBe(200);

        const results = searchResult.body;
        expect(Array.isArray(results)).toBeTruthy();
        expect(results.length).toBe(0);
    });

    it('Search will fail if user not logged in', async () => {
        const searchResult = await request(app)
            .get('/user/search')
            .set('User-Agent', "PushPinTestClient")
            .send();

        expect(searchResult.statusCode).toBe(403)
    });

    it('Search will fail if no query term provided', async () => {
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

        const searchResult = await request(app)
            .get('/user/search')
            .set('Authorization', `Bearer ${tokenInfo.token}`)
            .set('User-Agent', "PushPinTestClient")
            .send();

        expect(searchResult.statusCode).toBe(400);
    });

    it('Search will fail if too many query terms provided', async () => {
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

        const searchResult = await request(app)
            .get('/user/search?query=Too Many Keywords')
            .set('Authorization', `Bearer ${tokenInfo.token}`)
            .set('User-Agent', "PushPinTestClient")
            .send();

        expect(searchResult.statusCode).toBe(400);
    });

    //
    // it('Search will fail if user not logged in', async () => {

    //
    //     // Try and create a note with the recipients list missing
    //     const res = await request(app)
    //         .post('/note')
    //         .set('User-Agent', "PushPinTestClient")
    //         .set('Authorization', `Bearer ${tokenInfo.token}`)
    //         .send({
    //             "style": fixture.notes.polaroid1.style,
    //             "message": fixture.notes.polaroid1.message,
    //         });
    //
    //     expect(res.statusCode).toBe(400);
    //     expect(res.body).toHaveProperty('errors');
    //     expect(res.body.errors.length).toBe(1);
    //     expect(res.body.errors[0]).toContain("recipients");
    // });
    //
    // it('Create note will succeed if all sufficient parameters are given', async () => {
    //     const loginResult = await request(app)
    //         .post('/login')
    //         .set('User-Agent', "PushPinTestClient")
    //         .send({
    //             "email": fixture.users.mctest.email,
    //             "password": fixture.users.mctest.password,
    //         });
    //
    //     expect(loginResult.statusCode).toBe(200)
    //     expect(loginResult.body).toHaveProperty('user');
    //     expect(loginResult.body).toHaveProperty('tokenInfo');
    //
    //     const tokenInfo = loginResult.body.tokenInfo;
    //
    //     // Try and create a note with all required data present.
    //     const res = await request(app)
    //         .post('/note')
    //         .set('User-Agent', "PushPinTestClient")
    //         .set('Authorization', `Bearer ${tokenInfo.token}`)
    //         .send({
    //             "style": fixture.notes.polaroid1.style,
    //             "message": fixture.notes.polaroid1.message,
    //             "recipientsList": fixture.notes.polaroid1.recipientsList,
    //         });
    //
    //     expect(res.statusCode).toBe(200);
    //     expect(res.body).toHaveProperty('success');
    //     expect(res.body.success).toBe(true);
    //     expect(res.body).toHaveProperty('note');
    //     expect(res.body.note).toHaveProperty('id');
    //     expect(res.body.note).toHaveProperty('color');
    //     expect(res.body.note).toHaveProperty('imageUrl');
    //     expect(res.body.note).toHaveProperty('message');
    //     expect(res.body.note).toHaveProperty('style');
    //     expect(res.body.note).toHaveProperty('recipientsList');
    //     expect(res.body.note.id).toBeGreaterThan(0);
    // });
});
