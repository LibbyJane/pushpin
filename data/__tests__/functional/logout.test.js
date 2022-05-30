const request = require('supertest');
const appModule = require('./../../app');
const fixture = require("../../modules/testing/fixture.json");
const app = appModule.app;

describe('Logout Test', () => {
    it('Logout will succeed following successful login', async () => {
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
            .get('/logout')
            .set('User-Agent', "PushPinTestClient")
            .set('Authorization', `Bearer ${tokenInfo.token}`)
            .send();

        expect(res.statusCode).toBe(200)
    });
});
