const authenticate = require('./functions/authenticate.js');
const handleError = require('./functions/handleError.js');
const displayCheckbox = require('./functions/displayCheckbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const getUserInfo = require('./functions/getUserInfo.js');

/**
 * Get the metadata of a file with a given id
 *
 * @param {object} options - Extra options.
 * @returns {void}
 */
module.exports = async(options) => {
    options.refresh = true;

    const checkedVersion = await checkNewVersion();
    const auth = await authenticate(options);
    const info = await getUserInfo(auth);

    process.stdout.write(`You are successfully authenticated as \'${info.email}\'`);
    displayCheckbox('green');
    // process.exit(0);
    return;
};
