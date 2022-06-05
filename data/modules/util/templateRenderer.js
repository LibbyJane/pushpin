const { TwingEnvironment, TwingLoaderFilesystem } = require('twing');

module.exports.getTemplateRenderer = (cachePath = "", templatesDirectoryPath = "") => {

    const TemplateRenderer = function() {
        this.renderTemplate = (templateName = "", templateData = {}) => {
            return new Promise((resolve, reject) => {
                const loader = new TwingLoaderFilesystem(templatesDirectoryPath);
                const twing = new TwingEnvironment(loader, {
                    'cache': cachePath,
                });

                twing.render(templateName, templateData).then(async (output) => {
                    // do something with the output
                    //console.log('Output', output);
                    resolve(output);
                }).catch((error) => {
                    reject(error);
                });
            });
        }
    }

    return new TemplateRenderer();
}