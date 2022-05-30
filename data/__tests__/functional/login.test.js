const request = require('supertest');
const appModule = require('./../../app');
const app = appModule.app;

describe('Login Test', () => {
    it('Login will fail if incorrect credentials given', async () => {
        // Missing password field.
        const res = await request(app)
            .post('/login')
            .send({
                "email": "McTesterson@example.com",
                "password": "McTesterson2023",
            })
        expect(res.statusCode).toBe(400)
    });

    it('Login will success with correct credentials', async () => {
        // Missing password field.
        const res = await request(app)
            .post('/login')
            .send({
                "email": "McTesterson@example.com",
                "password": "McTesterson2022",
            })
        expect(res.statusCode).toBe(200)

        expect(res.body).toHaveProperty('user');
        expect(res.body).toHaveProperty('tokenInfo');
    });
})
