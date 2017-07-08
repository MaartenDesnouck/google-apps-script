const authenticate = require('./functions/authenticate.js');
const getMetadata = require('./functions/getMetadata.js');
const downloadRemote = require('./functions/downloadRemote.js');
const handleError = require('./functions/handleError.js');
const colors = require('colors');
const readline = require('readline');

/**
 * Link a remote Google Apps Script project to the current folder
 *
 * @param {string} fileId - Id of the remote project to link to the current folder.
 */
module.exports = function(identifier) {
    process.stdout.write('Linking to this folder...');
    authenticate([], function(err, auth) {
        if (err) {
            process.stdout.write(' [' + '✘'.red + ']\n');
            handleError(auth, err);
        } else {
            getMetadata(auth, identifier, function(err, metadata) {
                if (err) {
                    process.stdout.write(' [' + '✘'.red + ']\n');
                    handleError(auth, err);
                } else {
                    process.stdout.clearLine();
                    readline.cursorTo(process.stdout, 0);
                    process.stdout.write('Linking \'' + metadata.name +'\' to this folder...');
                    downloadRemote(auth, metadata.id, null, 'link', function(err) {
                        if (err) {
                            process.stdout.write(' [' + '✘'.red + ']\n');
                            handleError(auth, err);
                        } else {
                            process.stdout.write(' [' + '✔'.green + ']\n');
                        }
                    });
                }
            });
        }
    });
};
