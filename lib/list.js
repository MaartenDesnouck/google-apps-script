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
module.exports = (filter) => {
    const checkedVersion = checkNewVersion();

    const gotAuth = Promise.all([checkedVersion, ]).then((values) => {
        return authenticate([]);
    });

    Promise.all([gotAuth, ]).then((values) => {
        return listScriptFiles(values[0], filter, true, null, []);
    }).catch((err) => {
        handleError(err, false);
        process.exit(1);
    });
};
