const authenticate = require('./functions/authenticate.js');
const handleError = require('./functions/handleError.js');
const getUserInfo = require('./functions/getUserInfo.js');
const printCheckbox = require('./functions/printCheckbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Get the metadata of a file with a given id
 *
 * @param {object} options - Extra options.
 * @returns {void}
 */
module.exports = (options) => {
    options.refresh = true;
    checkNewVersion().then(() => {
        return authenticate(options);
    }).then(auth => {
        return getUserInfo(auth);
    }).then(info => {
        process.stdout.write(`You are succesfully authenticated as \'${info.email}\'`);
        printCheckbox('green');
    }).catch(err => {
        handleError(auth, err, false);
    });
};
