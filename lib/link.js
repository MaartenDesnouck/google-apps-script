var authenticate = require('./functions/authenticate.js');
var getMetadata = require('./functions/getMetadata.js');
var downloadRemote = require('./functions/downloadRemote.js');
var handleError = require('./functions/handleError.js');
var colors = require('colors');
var readline = require('readline');

/**
 * Link a remote Google Apps Script project to the current folder
 *
 * @param {string} fileId - Id of the remote project to link to the current folder.
 */
module.exports = function(identifier) {
    process.stdout.write('Linking to this folder...');
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
                    process.stdout.write('Linking \'' + metadata.name +'\' to this folder...');
                    downloadRemote(oauth2Client, metadata.id, null, 'link', function(err) {
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
