const config = require('./../../config.json');
const emailSenderModule = require('../comms/services/emailSender');

const Factory = function (config) {
    this.getEmailSender = () => {
        return emailSenderModule.getEmailSender(
            config.email.host,
            config.email.port,
            config.email.auth.user,
            config.email.auth.pass,
            config.email.secure,
            config.email.checkCertificate,
            config.email.defaultFromEmailAddress
        );
    }
}

module.exports.getFactory = function() {
    return new Factory(config);
}