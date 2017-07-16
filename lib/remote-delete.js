const authenticate = require('./functions/authenticate.js');
const getMetadata = require('./functions/getMetadata.js');
const remoteDeleteProject = require('./functions/remoteDeleteProject.js');
const handleError = require('./functions/handleError.js');
const printCheckbox = require('./functions/printCheckbox.js');
const readline = require('readline');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Delete a Google Apps Script project from your Google Drive
 *
 * @param {string} identifier - Identifier of the remote project to link to the current folder.
 * @returns {void}
 */
module.exports = (identifier) => {
    process.stdout.write(`Deleting \'${identifier}\' from your Google Drive...`);
    const checkedVersion = checkNewVersion();
    const gotAuth = authenticate([]);

    const gotMetadata = Promise.all([gotAuth, checkedVersion, ]).then((values) => {
        return getMetadata(values[0], identifier);
    });

    const deleted = Promise.all([gotAuth, gotMetadata]).then((values) => {
        const metadata = values[1];
        process.stdout.clearLine();
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Deleting \'${metadata.name}\' from your Google Drive...`);
        return remoteDeleteProject(values[0], metadata.id, metadata.name);
    });

    deleted.then(() => {
        printCheckbox('green');
        return;
    });

    // Catch all the errors
    gotAuth.then((auth) => {
        Promise.all([gotMetadata, deleted, checkedVersion, ]).catch((err) => {
            handleError(auth, err, false);
            return;
        });
    }).catch((err) => {
        handleError(null, err, false);
        return;
    });
};
