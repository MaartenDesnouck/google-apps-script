const fs = require('fs');
const readline = require('readline');
const authenticate = require('./functions/authenticate.js');
const downloadRemote = require('./functions/downloadRemote.js');
const unpackRemote = require('./functions/unpackRemote.js');
const getMetadata = require('./functions/getMetadata.js');
const handleError = require('./functions/handleError.js');
const constants = require('./constants.js');
const printCheckbox =  require('./functions/printCheckbox.js');

/**
 * Clone a remote Google Apps Script project
 *
 * @param {string} fileId - Id of the project we want to clone.
 * @returns {void}
 */
module.exports = (identifier) => {
    process.stdout.write('Cloning from Google Drive...');
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
                    process.stdout.write('Cloning \'' + metadata.name + '\' from Google Drive...');
                    downloadRemote(auth, metadata.id, metadata.name, 'clone', (err) => {
                        if (err) {
                            handleError(auth, err, true);
                        } else {
                            unpackRemote(metadata.name, (err) => {
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
        }
    });
};
