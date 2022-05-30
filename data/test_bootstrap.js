const database = require('./database');
const userRegistrationService = require('./modules/users/services/userRegistrationService');
const fixture = require('./modules/testing/fixture.json');

const go = async () => {
    try {
        const dbManager = database.dbManager;
        await dbManager.deleteDb();
        await dbManager.deleteMigrationStoreFile();
        await dbManager.migrate();

        // Insert a couple of test users so that we can use to login
        let result = await userRegistrationService.do(
            dbManager,
            fixture.users.mctest.firstName,
            fixture.users.mctest.lastName,
            fixture.users.mctest.displayName,
            fixture.users.mctest.email,
            fixture.users.mctest.password,
            fixture.ipAddress,
            fixture.userAgent,
        );

        if (result.errors.length > 0) {
            throw new Error('Failed to created McTest');
        }

        result = await userRegistrationService.do(
            dbManager,
            fixture.users.mcfuzz.firstName,
            fixture.users.mcfuzz.lastName,
            fixture.users.mcfuzz.displayName,
            fixture.users.mcfuzz.email,
            fixture.users.mcfuzz.password,
            fixture.ipAddress,
            fixture.userAgent,
        );

        if (result.errors.length > 0) {
            throw new Error('Failed to created McFuzz');
        }
    } catch (error) {
        console.log("Caught error", error);
    }
}

go();