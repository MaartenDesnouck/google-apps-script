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
    const checkedVersion = checkNewVersion();
    const gotAuth = authenticate([]);

    const listed = Promise.all([gotAuth, checkedVersion, ]).then((values) => {
        return listScriptFiles(values[0], nameFilter, true, null, []);
    });

    // Catch all the errors
    gotAuth.then((auth) => {
        Promise.all([listed, checkedVersion, ]).catch((err) => {
            handleError(auth, err, false);
            return;
        });
    }).catch((err) => {
        handleError(null, err, false);
        return;
    });
};
