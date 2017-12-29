const authenticate = require('./functions/authenticate.js');
const listScriptFiles = require('./functions/listScriptFiles.js');
const error = require('./functions/error.js');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * List all remote Google Apps Script projects matching an optional name filter.
 *
 * @param {String} filter - Filter to filter projects on.
 * @returns {void}
 */
module.exports = async(filter) => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        auth = await authenticate([]);
        const listedScriptFiles = await listScriptFiles(auth, filter, true, null, []);
        process.exit(0);
    } catch (err) {
        await error.log(err, auth);
        process.exit(1);
    }
};
