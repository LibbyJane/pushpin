const request = require('supertest');
const appModule = require('./../../app');
const fixture = require("../../modules/testing/fixture.json");
const app = appModule.app;

describe('Upload User Photo', () => {
    it('Upload profile photo will fail if not photo sent', async () => {
        let res = await request(app)
            .post('/login')
            .set('User-Agent', "PushPinTestClient")
            .send({
                "email": fixture.users.mctest.email,
                "password": fixture.users.mctest.password,
            });

        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('user');
        expect(res.body).toHaveProperty('tokenInfo');

        const tokenInfo = res.body.tokenInfo;

        res = await request(app)
            .post('/upload/profile_photo')
            .set('User-Agent', "PushPinTestClient")
            .set('Authorization', `Bearer ${tokenInfo.token}`)
            .attach('profilePhoto', 'resources/monkey.jpg');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body).toHaveProperty('imageUrl');
        expect(res.body.success).toBe(true);
        expect(res.body.imageUrl).toContain('http');
        expect(res.body.imageUrl).toContain('profile_' + fixture.users.mctest.id + ".jpg");

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
