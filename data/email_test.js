const factory = require('./modules/factory/factory');

const sendEmailTest = async () => {
    const factoryInstance = factory.getFactory();
    const sender = factoryInstance.getEmailSender();

    // TODO - write html template parsing - we want to provide a template name an a map of variables and have the html returned as a string.

    const success = await sender.sendMessage("andy@andychapman.net", "This is a test message", "Hi there", "<p>Hi there</p>");
    if (success) {
        console.log('Email sent OK');
    } else {
        const lastError = sender.getLastError();
        console.log('Caught error: ', lastError.toString());
    }
};

(async ()=>{
    await sendEmailTest();
})();