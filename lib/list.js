const authenticate = require('./functions/authenticate.js');
const listScriptFiles = require('./functions/listScriptFiles.js');
const handleError = require('./functions/handleError.js');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * List all remote Google Apps Script projects matching an optional name filter.
 *
 * @param {string} nameFilter - Filter to filter projects on.
 * @returns {void}
 */
module.exports = (nameFilter) => {
    checkNewVersion().then(() => {
        return authenticate([]);
    }).then(auth => {
        return listScriptFiles(auth, nameFilter, true, null, []);
    }).then(allFiles => {
        // Do nothing;
    }).catch(err => {
        return handleError(auth, err, false);
    });
};
