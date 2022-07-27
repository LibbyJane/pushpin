const request = require('supertest');
const appModule = require('./../../app');
const fixture = require('./../../modules/testing/fixture.json');

const app = appModule.app;

describe('Create Invitation Test', () => {
    it('Will fail if the user is not logged in', async () => {
        const inviteResult = await request(app)
            .post('/invite')
            .set('User-Agent', "PushPinTestClient")
            .send({});

        expect(inviteResult.statusCode).toBe(403)
    });

    it('Will create invitation for the logged in user', async () => {
        const loginResult = await request(app)
            .post('/login')
            .set('User-Agent', "PushPinTestClient")
            .send({
                "email": fixture.users.mctest.email,
                "password": fixture.users.mctest.password,
            });

        expect(loginResult.statusCode).toBe(200)
        expect(loginResult.body).toHaveProperty('user');
        expect(loginResult.body).toHaveProperty('tokenInfo');

        const tokenInfo = loginResult.body.tokenInfo;

        const inviteResult = await request(app)
            .post('/invite')
            .set('User-Agent', "PushPinTestClient")
            .set('Authorization', `Bearer ${tokenInfo.token}`)
            .send({});

        // Ensure we get a successful result.  There should be a 36 character long code.
        expect(inviteResult.statusCode).toBe(200)
        expect(inviteResult.body).toHaveProperty('code');
        expect(inviteResult.body.code.length).toEqual(36);
    });

    it('Get the details of the user who sent an invitation', async () => {
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

        const inviteResult = await request(app)
            .post('/invite')
            .set('User-Agent', "PushPinTestClient")
            .set('Authorization', `Bearer ${tokenInfo.token}`)
            .send({});

        // Ensure we get a successful result.  There should be a 36 character long code.
        expect(inviteResult.statusCode).toBe(200);
        expect(inviteResult.body).toHaveProperty('code');

        const inviteCode = inviteResult.body.code;

        // Get user result
        const getInviteSenderResult = await request(app)
            .get(`/user/invite/${inviteCode}`)
            .set('User-Agent', "PushPinTestClient")
            .set('Authorization', `Bearer ${tokenInfo.token}`)
            .send({});

        // Ensure we get a successful result.  There should be a 36 character long code.
        expect(getInviteSenderResult.statusCode).toBe(200)
        expect(getInviteSenderResult.body).toHaveProperty('id');
        expect(getInviteSenderResult.body).toHaveProperty('firstName');
        expect(getInviteSenderResult.body).toHaveProperty('displayName');
        expect(getInviteSenderResult.body).toHaveProperty('lastName');
        expect(getInviteSenderResult.body).toHaveProperty('imageURL');
    });
});
