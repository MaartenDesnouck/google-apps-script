const authenticate = require('./functions/authenticate.js');
const getMetadata = require('./functions/getMetadata.js');
const downloadRemote = require('./functions/downloadRemote.js');
const handleError = require('./functions/handleError.js');
const printCheckbox = require('./functions/printCheckbox.js');
const readline = require('readline');

/**
 * Link a remote Google Apps Script project to the current folder
 *
 * @param {string} identifier - Identifier of the remote project to link to the current folder.
 * @returns {void}
 */
module.exports = (identifier) => {
    process.stdout.write('Linking to this folder...');
    authenticate([]).then(() => {
        return authenticate(options);
    }).then(auth => {
        return getMetadata(auth, identifier);
    }).then(auth => {
        process.stdout.clearLine();
        readline.cursorTo(process.stdout, 0);
        process.stdout.write('Linking \'' + metadata.name + '\' to this folder...');
        return downloadRemote(auth, metadata.id, null, 'link');
    }).then(() => {
        printCheckbox('green');
    }).catch(err => {
        handleError(auth, err, false);
    });
};
