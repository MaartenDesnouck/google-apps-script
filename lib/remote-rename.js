const authenticate = require('./functions/authenticate.js');
const getMetadata = require('./functions/getMetadata.js');
const remoteRenameProject = require('./functions/remoteRenameProject.js');
const handleError = require('./functions/handleError.js');
const printCheckbox = require('./functions/printCheckbox.js');
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
    checkNewVersion().then(() => {
        return authenticate(options);
    }).then(auth => {
        return getMetadata(auth, identifier);
    }).then(metadata => {
        process.stdout.clearLine();
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Renaming \'${metadata.name}\' to \'${newName}\' in your Google Drive...`);
        return remoteRenameProject(auth, metadata.id, metadata.name, newName);
    }).then(renamed => {
        if (renamed) {
            printCheckbox('green');
        } else {
            printCheckbox('yellow');
            process.stdout.write('Skipped renaming because old and new name appear to be the same\n');
        }
    }).catch(err => {
        handleError(auth, err, false);
    });
};
