const sql = `
    SELECT id, firstName, lastName, displayName, imageURL, email, password
    FROM users
    WHERE email = ?
`

module.exports.do = async (databaseManager, email, exceptionIfNotExisting) => {
    const user = await databaseManager.getRow(sql, [email]);

    // If no matching user was found, return a login failure message.
    if (!user) {
        if (exceptionIfNotExisting) {
            throw new Error(`could not find user with email ${email}`);
        }
    }

    return user;
}
