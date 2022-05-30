function getEnvironment() {
    const env = process.env.NODE_ENV || 'dev';
    return env;
}

module.exports.isUnderTest = () => {
    return getEnvironment() === 'test';
}