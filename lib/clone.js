const fs = require('fs');
const colors = require('colors');
const readline = require('readline');
const authenticate = require('./functions/authenticate.js');
const downloadRemote = require('./functions/downloadRemote.js');
const unpackRemote = require('./functions/unpackRemote.js');
const getMetadata = require('./functions/getMetadata.js');
const handleError = require('./functions/handleError.js');
const constants = require('./constants.js');

/**
 * Clone a remote Google Apps Script project
 *
 * @param {string} fileId - Id of the project we want to clone.
 */
module.exports = function(identifier) {
    process.stdout.write('Cloning from Google Drive...');
    authenticate([], function(err, oauth2Client) {
        if (err) {
            process.stdout.write(' [' + '✘'.red + ']\n');
            handleError(err);
        } else {
            getMetadata(oauth2Client, identifier, function(err, metadata) {
                if (err) {
                    process.stdout.write(' [' + '✘'.red + ']\n');
                    handleError(err);
                } else {
                    process.stdout.clearLine();
                    readline.cursorTo(process.stdout, 0);
                    process.stdout.write('Cloning \'' + metadata.name + '\' from Google Drive...');
                    downloadRemote(oauth2Client, metadata.id, metadata.name, 'clone', function(err) {
                        if (err) {
                            process.stdout.write(' [' + '✘'.red + ']\n');
                            handleError(err);
                        } else {
                            unpackRemote(metadata.name, function(err) {
                                if (err) {
                                    process.stdout.write(' [' + '✘'.red + ']\n');
                                    handleError(err);
                                } else {
                                    process.stdout.write(' [' + '✔'.green + ']\n');
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};
