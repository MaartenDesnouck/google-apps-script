const authenticate = require('./functions/authenticate.js');
const error = require('./functions/error.js');
const checkbox = require('./functions/checkbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const getUserInfo = require('./functions/getUserInfo.js');

/**
 * Get the metadata of a file with a given id
 *
 * @param {Object} options - Extra options.
 * @returns {void}
 */
module.exports = async (options) => {
    options.refresh = true;
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        auth = await authenticate(options);
        const info = await getUserInfo(auth);
        process.stdout.write(`You are successfully authenticated as '${info.email}'`);
        checkbox.display('green');
        process.exit(0);
    } catch (err) {
        checkbox.display('red');
        await error.log(err, auth);
        process.exit(1);
    }
};
