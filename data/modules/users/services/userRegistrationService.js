const tokens = require("./../../../tokens");
const validationModule = require("./../../../validationModule");
const getUserByEmail = require('./getUserByEmail');
const hashService = require('./../../security/services/hashService');

const getResult = (errors = [], user = null, token = null) => {
    return {
        errors,
        user,
        token
    }
}

module.exports.do = async (databaseManager, firstName, lastName, displayName, email, password, userIpAddress, userAgent) => {

    const errors = validationModule.allStringsInArrayAreNotEmpty([
        {
            "name": "firstName",
            "value": firstName
        },
        {
            "name": "lastName",
            "value": lastName,
        },
        {
            "name": "displayName",
            "value": displayName,
        },
        {
            "name": "email",
            "value": email,
        },
        {
            "name": "password",
            "value": password,
        },
    ]);

    if (errors.length !== 0) {
        return getResult(errors);
    }

    if (!validationModule.isEmailAddress(email)) {
        errors.push('You must supply a valid email address');
        return getResult(errors);
    }

    if (password.length < 6) {
        errors.push('Your password must be at least 6 characters long');
        return getResult(errors);
    }

    try {
        // Make sure the user doesn't already exist in the system.
        let user = await getUserByEmail.do(databaseManager, email, false);

        if (user) {
            errors.push(`This email address is already registered with us`);
            return getResult(errors);
        }

        const hashedPassword = await hashService.hash(password);

        const params = [firstName, lastName, displayName, email, '', hashedPassword];

        const insertSql = `
            INSERT INTO users(firstName, lastName, displayName, email, uid, password)
            VALUES(?, ?, ?, ?, ?, ?);`;

        // Insert the new user
        await databaseManager.execute(insertSql, params);

        // Load the user and then delete the password attribute so that we don't send that back to the client.
        user = await getUserByEmail.do(databaseManager, email);
        delete user.password;

        // Log the user in.
        const token = await tokens.createToken(databaseManager, user.id, userAgent, userIpAddress);

        return getResult([], user, token);
    } catch (error) {
        errors.push(error.toString());
        return getResult(errors);
    }
}