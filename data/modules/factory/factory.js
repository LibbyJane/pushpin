const config = require('./../../config.json');
const emailSenderModule = require('../comms/services/emailSender');
const { getTemplateRenderer } = require("../util/templateRenderer");
const { fileHelper } = require('../util/fileHelper');

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

    this.getTemplateRenderer = async () => {
        const installPath = config.files.installPath ?? '';

        let exists = await fileHelper.directoryExists(installPath);
        if (!exists) {
            throw new Error(`Install directory "${installPath}" does not exist`);
        }

        const templatesPath = installPath + config.files.templatesPath ?? '';

        exists = await fileHelper.directoryExists(templatesPath);
        if (!exists) {
            throw new Error(`Templates directory "${templatesPath}" does not exist`);
        }

        const cachePath = installPath + config.files.cachePath ?? '';
        exists = await fileHelper.directoryExists(cachePath);
        if (!exists) {
            throw new Error(`Cache directory "${cachePath}" does not exist`);
        }

        return getTemplateRenderer(cachePath, templatesPath);
    }
}

module.exports.getFactory = function() {
    return new Factory(config);
}