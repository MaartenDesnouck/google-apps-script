const fs = require('fs-extra');
const readline = require('readline');
const authenticate = require('./functions/authenticate.js');
const getMetadata = require('./functions/getMetadata.js');
const downloadRemote = require('./functions/downloadRemote.js');
const unpackRemote = require('./functions/unpackRemote.js');
const displayCheckbox = require('./functions/displayCheckbox.js');
const handleError = require('./functions/handleError.js');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Clone a remote Google Apps Script project
 *
 * @param {string} identifier - Identifier of the project we want to clone.
 * @returns {void}
 */
module.exports = (identifier) => {
    const checkedVersion = checkNewVersion();
    checkedVersion.then(() => {
        process.stdout.write('Cloning from Google Drive...');
    });
    const gotAuth = authenticate([]);

    const gotMetadata = Promise.all([gotAuth, checkedVersion, ]).then((values) => {
        return getMetadata(values[0], identifier);
    });

    const downloaded = Promise.all([gotAuth, gotMetadata, ]).then((values) => {
        const metadata = values[1];
        process.stdout.clearLine();
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Cloning \'${metadata.name}\' from Google Drive...`);
        return downloadRemote(values[0], metadata.id, metadata.name, 'clone');
    });

    const unpacked = Promise.all([downloaded, gotMetadata, ]).then((values) => {
        return unpackRemote(values[1].name);
    });

    const finished = unpacked.then(() => {
        displayCheckbox('green');
        return;
    });

    // Catch all the errors
    Promise.all([gotAuth, gotMetadata, downloaded, unpacked, checkedVersion, finished, ]).catch((err) => {
        handleError(err, true);
        return;
    });
};
