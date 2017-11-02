const authenticate = require('./functions/authenticate.js');
const getMetadata = require('./functions/getMetadata.js');
const remoteRenameProject = require('./functions/remoteRenameProject.js');
const handleError = require('./functions/handleError.js');
const displayCheckbox = require('./functions/displayCheckbox.js');
const readline = require('readline');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Rename a Google Apps Script project from Google Drive
 *
 * @param {string} identifier - Id of the remote project to rename.
 * @param {string} newProjectName - new name of the project.
 * @returns {void}
 */
module.exports = (identifier, newProjectName) => {
    const checkedVersion = checkNewVersion();

    const output = Promise.all([checkedVersion, ]).then(() => {
        process.stdout.write(`Renaming project to \'${newProjectName}\' in your Google Drive...`);
    });

    const gotAuth = Promise.all([output, ]).then(() => {
        return authenticate([]);
    });

    const gotMetadata = Promise.all([gotAuth, ]).then((values) => {
        return getMetadata(values[0], identifier);
    });

    const renamed = Promise.all([gotAuth, gotMetadata, ]).then((values) => {
        const metadata = values[1];
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Renaming \'${metadata.name}\' to \'${newProjectName}\' in your Google Drive...`);
        return remoteRenameProject(values[0], metadata.id, metadata.name, newProjectName);
    });

    renamed.then((renamed) => {
        if (renamed) {
            displayCheckbox('green');
        } else {
            displayCheckbox('yellow');
            process.stdout.write('Skipped renaming because old and new name appear to be the same\n');
        }
        return;
    }).catch((err) => {
        handleError(err, true);
    });
};
