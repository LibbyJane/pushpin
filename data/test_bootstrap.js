const database = require('./database');
const userRegistrationService = require('./modules/users/services/userRegistrationService');

const go = async () => {
    try {
        const dbManager = database.dbManager;
        await dbManager.deleteDb();
        await dbManager.deleteMigrationStoreFile();
        await dbManager.migrate();

        // Insert a test user that we can use to login
        await userRegistrationService.do(
            dbManager,
            'Testy',
            'McTesterson',
            'McTest',
            'mctest@example.com',
            'McTest#2022',
            '127.0.0.1',
            'TestUserAgent'
        );
    } catch (error) {
        console.log("Caught error", error);
    }
}

go();