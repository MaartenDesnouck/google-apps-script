const authenticate = require('./functions/authenticate.js');
const getMetadata = require('./functions/getMetadata.js');
const remoteRenameProject = require('./functions/remoteRenameProject.js');
const handleError = require('./functions/handleError.js');
const printCheckbox = require('./functions/printCheckbox.js');
const readline = require('readline');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Rename a Google Apps Script project from Google Drive
 *
 * @param {string} identifier - Id of the remote project to rename.
 * @param {string} newName - new name of the project.
 * @returns {void}
 */
module.exports = (identifier, newName) => {
    process.stdout.write(`Renaming project to \'${newName}\' in your Google Drive...`);
    const checkedVersion = checkNewVersion();
    const gotAuth = authenticate([]);

    const gotMetadata = Promise.all([gotAuth, checkedVersion, ]).then((values) => {
        return getMetadata(values[0], identifier);
    });

    const renamed = Promise.all([gotAuth, gotMetadata, ]).then((values) => {
        const metadata = values[1];
        process.stdout.clearLine();
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Renaming \'${metadata.name}\' to \'${newName}\' in your Google Drive...`);
        return remoteRenameProject(values[0], metadata.id, metadata.name, newName);
    });

    renamed.then((renamed) => {
        if (renamed) {
            printCheckbox('green');
        } else {
            printCheckbox('yellow');
            process.stdout.write('Skipped renaming because old and new name appear to be the same\n');
        }
        return;
    });

    // Catch all the errors
    gotAuth.then((auth) => {
        Promise.all([gotMetadata, renamed, checkedVersion, ]).catch((err) => {
            handleError(auth, err, false);
            return;
        });
    }).catch((err) => {
        handleError(null, err, false);
        return;
    });
};
