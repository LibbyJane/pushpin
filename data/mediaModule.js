const im = require("imagemagick");

module.exports.getMediaService = (config) => {
    const convertPath = config.files.imageMagikConvertPath;

    if ((!config.hasOwnProperty('files')) || (!config.files.hasOwnProperty('imageMagikConvertPath'))) {
        throw Error('Invalid config object - missing config.files.imageMagikConvertPath');
    }

    if ((typeof convertPath !== 'string') || (convertPath.length < 5)) {
        throw Error('Invalid config object - config.files.imageMagikConvertPath looks invalid');
    }

    return {
        resizePhoto: (sourceFile, targetFile, maxWidth = 400) => {
            im.convert.path = convertPath;

            return new Promise((resolve, reject) => {
                im.resize({
                    srcPath: sourceFile,
                    dstPath: targetFile,
                    width:   maxWidth
                }, function(err, stdout, stderr){
                    if (err) {
                        reject(err);
                    } else {
                        resolve()
                    }
                });
            });
        },
        getImageExtension: (image) => {
            if (!image.hasOwnProperty('mimetype')) {
                throw Error('Invalid image object passed');
            }

            const mimeType = image.mimetype;

            if ((mimeType === 'image/jpeg') || (mimeType === 'image/jpg')) {
                return 'jpg';
            } else if (mimeType === 'image/png') {
                return 'png';
            }

            return '';
        }
    }
}
