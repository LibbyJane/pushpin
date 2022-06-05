const factory = require('./modules/factory/factory');

const sendEmailTest = async () => {
    const factoryInstance = factory.getFactory();

    // Create an instance of the template renderer to we can convert HTML and TXT twig templates into the actual messages to send.
    const templateRenderer = await factoryInstance.getTemplateRenderer();
    const sender = factoryInstance.getEmailSender();

    // Define the email template data.
    const templateData = {
        displayName: "AndyC",
        emailAddress: "andy@andychapman.net",
    }

    try {
        // Get that HTML and Text versions of the email that we want to send.
        const html = await templateRenderer.renderTemplate('email/newUserRegistration/html.twig', templateData);
        const text = await templateRenderer.renderTemplate('email/newUserRegistration/text.twig', templateData);

        // Send the email.
        const success = await sender.sendMessage("andy@andychapman.net", "Welcome to PushPin", text, html);
        if (success) {
            console.log('Email sent OK');
        } else {
            const lastError = sender.getLastError();
            console.log('Caught error: ', lastError.toString());
        }

    } catch (error) {
        console.log("Caught error when rendering template", error);
    }
};

(async ()=>{
    await sendEmailTest();
})();