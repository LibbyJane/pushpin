const request = require('supertest');
const appModule = require('./../../app');
const app = appModule.app;

describe('Registration Test', () => {
    it('Registration will fail if insufficient details given', async () => {
        // Missing password field.
        const res = await request(app)
            .post('/register')
            .set('User-Agent', "PushPinTestClient")
            .send({
                "firstName": "Registration",
                "lastName": "Test",
                "displayName": "RegistrationTest",
                "email": "registration@example.com",
            })
        expect(res.statusCode).toBe(400)
        expect(res.body).toHaveProperty('errors');
    });

    it('Registration will succeed if correct details given', async () => {
        // Missing password field.
        const res = await request(app)
            .post('/register')
            .set('User-Agent', "PushPinTestClient")
            .send({
                "firstName": "Registration",
                "lastName": "Test",
                "displayName": "RegistrationTest",
                "email": "registration@example.com",
                "password": "McTesterson2022",
            });

        expect(res.statusCode).toBe(200)
    });
})
