const nodemailer = require('nodemailer');
const validation = require('./../../../validationModule');

module.exports.getEmailSender = (
    smtpHost = "127.0.0.1",
    smtpPort = 25,
    smtpUsername = "",
    smtpPassword = "",
    secure = true,
    checkCertificate = true,
    emailFrom = "",
) => {
    const defaultEmailFrom = emailFrom;

    let lastError = null;

    const getTransporter = () => {
        if (!validation.isNonEmptyString(smtpHost)) {
            lastError = new Error(`smtpHost must be provided`);
            return false;
        }

        if (!validation.isPositiveInteger(smtpPort)) {
            lastError = new Error(`smtpPort must be provided and be a positive integer`);
            return false;
        }

        const options ={
            host: smtpHost,
            port: smtpPort,
            secure: secure, // upgrade later with STARTTLS
            auth: {
                user: smtpUsername,
                pass: smtpPassword,
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: secure,
            },
        };

        // If the username is empty, delete the auth block entirely.
        if (smtpUsername.length === 0) {
            options.delete('auth');
        }

        return nodemailer.createTransport(options);
    }

    return {
        "sendMessage": async (to, subject, messageText, messageHtml, from = "") => {
            if (!validation.isEmailAddress(to)) {
                lastError = new Error(`Invalid 'to' email address: ${to}`);
                return false;
            }

            if (!validation.isNonEmptyString(subject)) {
                lastError = new Error(`You must provide a message subject`);
                return false;
            }

            if (!validation.isNonEmptyString(messageText)) {
                lastError = new Error(`You must provide a text version of the message`);
                return false;
            }

            const transporter =  getTransporter();
            if (!transporter) {
                return false;
            }

            let sender = from;
            if (sender === "") {
                sender = defaultEmailFrom;
            }

            if (!validation.isEmailAddress(sender)) {
                lastError = new Error(`You must provide a valid email address for the sender, either as the default 'from' or the overridden 'from'`);
                return false;
            }

            const message = {
                from: sender,
                to: to,
                subject: subject,
                text: messageText,
                html: messageHtml
            }

            try {
                await transporter.sendMail(message);
                return true;
            } catch(error) {
                lastError = error;
                return false;
            }
        },
        /**
         * Returns the last error if there was any.
         * @returns {error|null}
         */
        "getLastError": () => {
            return lastError;
        }
    }
}