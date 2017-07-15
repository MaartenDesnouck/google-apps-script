const fs = require('fs');
const readline = require('readline');
const authenticate = require('./functions/authenticate.js');
const getMetadata = require('./functions/getMetadata.js');
const downloadRemote = require('./functions/downloadRemote.js');
const unpackRemote = require('./functions/unpackRemote.js');
const printCheckbox = require('./functions/printCheckbox.js');
const handleError = require('./functions/handleError.js');

/**
 * Clone a remote Google Apps Script project
 *
 * @param {string} identifier - Identifier of the project we want to clone.
 * @returns {void}
 */
module.exports = (identifier) => {
    process.stdout.write('Cloning from Google Drive...');
    checkNewVersion().then(() => {
        return authenticate(options);
    }).then(auth => {
        return getMetadata(auth, identifier);
    }).then(metadata => {
        process.stdout.clearLine();
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Cloning \'${metadata.name}\' from Google Drive...`);
        return downloadRemote(auth, metadata.id, metadata.name, 'clone');
    }).then(() => {
        return unpackRemote(metadata.name);
    }).then(() => {
        printCheckbox('green');
    }).catch(err => {
        return handleError(auth, err, false);
    });
};
