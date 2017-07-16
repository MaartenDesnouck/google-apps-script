const authenticate = require('./functions/authenticate.js');
const getMetadata = require('./functions/getMetadata.js');
const downloadRemote = require('./functions/downloadRemote.js');
const handleError = require('./functions/handleError.js');
const printCheckbox = require('./functions/printCheckbox.js');
const readline = require('readline');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Link a remote Google Apps Script project to the current folder
 *
 * @param {string} identifier - Identifier of the remote project to link to the current folder.
 * @returns {void}
 */
module.exports = (identifier) => {
    process.stdout.write('Linking to this folder...');
    const checkedVersion = checkNewVersion();
    const gotAuth = authenticate([]);

    const gotMetadata = Promise.all([gotAuth, checkedVersion, ]).then((values) => {
        return getMetadata(values[0], identifier);
    });

    const downloaded = Promise.all([gotMetadata, gotAuth, ]).then((values) => {
        const metadata = values[0];
        process.stdout.clearLine();
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Linking '${metadata.name} to this folder...`);
        return downloadRemote(values[1], metadata.id, null, 'link');
    });

    downloaded.then(() => {
        printCheckbox('green');
    });

    // Catch all the errors
    gotAuth.then((auth) => {
        Promise.all([gotMetadata, downloaded, checkedVersion, ]).catch((err) => {
            handleError(auth, err, false);
            return;
        });
    }).catch((err) => {
        handleError(null, err, false);
        return;
    });
};
