const request = require('supertest');
const appModule = require('./../../app');
const fixture = require('./../../modules/testing/fixture.json');

const app = appModule.app;

describe('Create Invitation Test', () => {
    it('Will fail if the user is not logged in', async () => {
        const inviteResult = await request(app)
            .post('/invite/accept/c6be7ab0-a4c0-4c73-a980-9494f157a407')
            .set('User-Agent', "PushPinTestClient")
            .send({});

        expect(inviteResult.statusCode).toBe(403);
    });

    it('Will fail if the invitation code is incorrect', async () => {
        const loginResult = await request(app)
            .post('/login')
            .set('User-Agent', "PushPinTestClient")
            .send({
                "email": fixture.users.mctest.email,
                "password": fixture.users.mctest.password,
            });

        expect(loginResult.statusCode).toBe(200);
        expect(loginResult.body).toHaveProperty('user');
        expect(loginResult.body).toHaveProperty('tokenInfo');

        const tokenInfo = loginResult.body.tokenInfo;

        const acceptinviteResult = await request(app)
            .post('/invite/accept/c6be7ab0-a4c0-4c73-a980-9494f157a407')
            .set('User-Agent', "PushPinTestClient")
            .set('Authorization', `Bearer ${tokenInfo.token}`)
            .send({});

        expect(acceptinviteResult.statusCode).toBe(400);
        expect(acceptinviteResult.body).toHaveProperty('errors');
        expect(acceptinviteResult.body.errors.length).toBeGreaterThanOrEqual(1);

        const errors = acceptinviteResult.body.errors;
        expect(errors[0]).toContain('Failed to find invitation');
    });

    it('Will succeed in creating the friendship and will return friends', async () => {
        // Login as McTest
        let loginResult = await request(app)
            .post('/login')
            .set('User-Agent', "PushPinTestClient")
            .send({
                "email": fixture.users.mctest.email,
                "password": fixture.users.mctest.password,
            });

        expect(loginResult.statusCode).toBe(200)
        expect(loginResult.body).toHaveProperty('user');
        expect(loginResult.body).toHaveProperty('tokenInfo');

        const tokenInfo1 = loginResult.body.tokenInfo;

        // Create an invitation as McTest
        const inviteResult = await request(app)
            .post('/invite')
            .set('User-Agent', "PushPinTestClient")
            .set('Authorization', `Bearer ${tokenInfo1.token}`)
            .send({});

        // Ensure we get a successful result.  There should be a 36 character long code.
        expect(inviteResult.statusCode).toBe(200);
        expect(inviteResult.body).toHaveProperty('code');
        const inviteCode = inviteResult.body.code;


        // Now login as McFuzz
        loginResult = await request(app)
            .post('/login')
            .set('User-Agent', "PushPinTestClient")
            .send({
                "email": fixture.users.mcfuzz.email,
                "password": fixture.users.mcfuzz.password,
            });

        expect(loginResult.statusCode).toBe(200);
        expect(loginResult.body).toHaveProperty('tokenInfo');

        const tokenInfo2 = loginResult.body.tokenInfo;

        // Accept the invitation whilst logged in as McFuzz.
        const acceptInviteResult = await request(app)
            .post(`/invite/accept/${inviteCode}`)
            .set('User-Agent', "PushPinTestClient")
            .set('Authorization', `Bearer ${tokenInfo2.token}`)
            .send({});

        expect(acceptInviteResult.statusCode).toBe(200);
        expect(acceptInviteResult.body).toHaveProperty('success');
        expect(acceptInviteResult.body.success).toBeTruthy();

        // We also expect that mctest and mcfuzz are now friends
        const friendsResult1 = await request(app)
            .get(`/friends`)
            .set('User-Agent', "PushPinTestClient")
            .set('Authorization', `Bearer ${tokenInfo2.token}`)
            .send({});

        expect(friendsResult1.statusCode).toBe(200);
        expect(Array.isArray(friendsResult1.body)).toBeTruthy();
        expect(friendsResult1.body.length).toBe(1);

        let firstFriend = friendsResult1.body[0];
        expect(firstFriend.hasOwnProperty('id')).toBeTruthy();
        expect(firstFriend.hasOwnProperty('firstName')).toBeTruthy();
        expect(firstFriend.hasOwnProperty('lastName')).toBeTruthy();
        expect(firstFriend.hasOwnProperty('displayName')).toBeTruthy();
        expect(firstFriend.hasOwnProperty('imageURL')).toBeTruthy();
        expect(firstFriend.id).toBe(1);

        // And we should see the same friendship using McTest's login token
        const friendsResult2 = await request(app)
            .get(`/friends`)
            .set('User-Agent', "PushPinTestClient")
            .set('Authorization', `Bearer ${tokenInfo1.token}`)
            .send({});

        expect(friendsResult2.statusCode).toBe(200);
        expect(Array.isArray(friendsResult2.body)).toBeTruthy();
        expect(friendsResult2.body.length).toBe(1);

        firstFriend = friendsResult2.body[0];
        expect(firstFriend.hasOwnProperty('id')).toBeTruthy();
        expect(firstFriend.hasOwnProperty('firstName')).toBeTruthy();
        expect(firstFriend.hasOwnProperty('lastName')).toBeTruthy();
        expect(firstFriend.hasOwnProperty('displayName')).toBeTruthy();
        expect(firstFriend.hasOwnProperty('imageURL')).toBeTruthy();
        expect(firstFriend.id).toBe(2);
    });
});
