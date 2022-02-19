const Cryptr = require('cryptr');
class sheild {
    cryptr = null;
    constructor(key) {
        this.cryptr = new Cryptr(key)
    }
    encrypt(text) {
        return this.cryptr.encrypt(text)
    }
    decrypt(cryptedString) {
        return this.cryptr.decrypt(cryptedString)
    }
}
module.exports = sheild