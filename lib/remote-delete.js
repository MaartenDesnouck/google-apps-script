const authenticate = require('./functions/authenticate.js');
const getMetadata = require('./functions/getMetadata.js');
const remoteDeleteProject = require('./functions/remoteDeleteProject.js');
const handleError = require('./functions/handleError.js');
const printCheckbox = require('./functions/printCheckbox.js');
const readline = require('readline');

/**
 * Delete a Google Apps Script project from your Google Drive
 *
 * @param {string} identifier - Identifier of the remote project to link to the current folder.
 * @returns {void}
 */
module.exports = (identifier) => {
    process.stdout.write(`Deleting \'${identifier}\' from your Google Drive...`);
    authenticate([], (err, auth) => {
        if (err) {
            handleError(auth, err, true);
        } else {
            getMetadata(auth, identifier, (err, metadata) => {
                if (err) {
                    handleError(auth, err, true);
                } else {
                    process.stdout.clearLine();
                    readline.cursorTo(process.stdout, 0);
                    process.stdout.write(`Deleting \'${metadata.name}\' from your Google Drive...`);
                    remoteDeleteProject(auth, metadata.id, metadata.name, (err, result) => {
                        if (err) {
                            handleError(auth, err, true);
                        } else {
                            printCheckbox('green');
                        }
                    });
                }
            });
        }
    });
};
