const config = require('./../../config.json');
const dailyDigestSenderModule = require('./../comms/services/dailyDigestSender');
const emailSenderModule = require('../comms/services/emailSender');
const { getTemplateRenderer } = require("../util/templateRenderer");
const { fileHelper } = require('../util/fileHelper');
const database = require('./../../database');
const noteServiceFactory = require('../notes/services/noteServiceFactory');

const Factory = function (config) {
    this.getDatabaseManager = () => {
        return database.dbManager;
    }

    this.getDigestSender = async () => {
        return dailyDigestSenderModule.getDigestSender(
            this.getDatabaseManager(),
            await this.getTemplateRenderer(),
            this.getEmailSender(),
            this.noteServiceFactory().recentNoteCountFetcher(),
            this.noteServiceFactory().recentReactionCountFetcher(),
        );
    }

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

    this.noteServiceFactory = () => {
        return noteServiceFactory.getFactory(config, this.getDatabaseManager());
    }
}

module.exports.getFactory = function() {
    return new Factory(config);
}