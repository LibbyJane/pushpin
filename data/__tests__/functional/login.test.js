const request = require('supertest');
const appModule = require('./../../app');
const fixture = require('./../../modules/testing/fixture.json');

const app = appModule.app;

describe('Login Test', () => {
    it('Login will fail if incorrect credentials given', async () => {
        // Missing password field.
        const res = await request(app)
            .post('/login')
            .set('User-Agent', "PushPinTestClient")
            .send({
                "email": fixture.users.mctest.email,
                "password": "Wr0ngPassw0rd!",
            });

        expect(res.statusCode).toBe(400)
    });

    it('Login will succeed with correct credentials', async () => {
        const res = await request(app)
            .post('/login')
            .set('User-Agent', "PushPinTestClient")
            .send({
                "email": fixture.users.mctest.email,
                "password": fixture.users.mctest.password,
            });

        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('user');
        expect(res.body).toHaveProperty('tokenInfo');
    });
});
