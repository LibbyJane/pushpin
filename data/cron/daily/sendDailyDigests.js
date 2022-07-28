const factory = require('./../../modules/factory/factory');

const factoryInstance = factory.getFactory();

(async ()=>{
    const digestSender = await factoryInstance.getDigestSender();
    await digestSender.sendDigest();
})();
