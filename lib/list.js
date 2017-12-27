const authenticate = require('./functions/authenticate.js');
const listScriptFiles = require('./functions/listScriptFiles.js');
const handleError = require('./functions/handleError.js');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * List all remote Google Apps Script projects matching an optional name filter.
 *
 * @param {string} filter - Filter to filter projects on.
 * @returns {void}
 */
module.exports = async(filter) => {
    const checkedVersion = await checkNewVersion();
    const auth = await authenticate([]);
    const listedScriptFiles = listScriptFiles(auth, filter, true, null, []);
    return;
};
