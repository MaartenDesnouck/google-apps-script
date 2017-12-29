const authenticate = require('./functions/authenticate.js');
const listScriptFiles = require('./functions/listScriptFiles.js');
const error = require('./functions/error.js');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * List all remote Google Apps Script projects matching an optional name filter.
 *
 * @param {string} filter - Filter to filter projects on.
 * @returns {void}
 */
module.exports = async(filter) => {
    try {
        const checkedVersion = await checkNewVersion();
        const auth = await authenticate([]);
        const listedScriptFiles = await listScriptFiles(auth, filter, true, null, []);
        process.exit(0);
    } catch (err) {
        await error.log(err);
        process.exit(1);
    }
};
