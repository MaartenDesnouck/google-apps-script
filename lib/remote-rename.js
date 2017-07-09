const authenticate = require('./functions/authenticate.js');
const getMetadata = require('./functions/getMetadata.js');
const remoteRenameProject = require('./functions/remoteRenameProject.js');
const handleError = require('./functions/handleError.js');
const printCheckbox = require('./functions/printCheckbox.js');
const colors = require('colors');
const readline = require('readline');

/**
 * Rename a Google Apps Script project from Google Drive
 *
 * @param {string} fileId - Id of the remote project to rename.
 * @param {string} newName - new name of the project.
 * @returns {void}
 */
module.exports = (identifier, newName) => {
    process.stdout.write(`Renaming project to \'${newName}\' in your Google Drive...`);
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
                    process.stdout.write(`Renaming \'${metadata.name}\' to \'${newName}\' in your Google Drive...`);
                    remoteRenameProject(auth, metadata.id, metadata.name, newName, (err, result, skipped) => {
                        if (err) {
                            handleError(auth, err, true);
                        } else if (result) {
                            printCheckbox('green');
                        } else if (skipped) {
                            printCheckbox('yellow');
                            process.stdout.write('Skipped renaming because old and new name appear to be the same\n');
                        }
                    });
                }
            });
        }
    });
};
