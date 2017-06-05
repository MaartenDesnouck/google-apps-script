var authenticate = require('./functions/authenticate.js');
var getMetadata = require('./functions/getMetadata.js');
var remoteDeleteProject = require('./functions/remoteDeleteProject.js');
var handleError = require('./functions/handleError.js');
var colors = require('colors');
var readline = require('readline');

/**
 * Delete a Google Apps Script project from your Google Drive
 *
 * @param {string} fileId - Id of the remote project to link to the current folder.
 */
module.exports = function(identifier) {
    process.stdout.write('Deleting \'' + identifier + '\' from your Google Drive...');
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
                    process.stdout.write('Deleting \'' + metadata.name + '\' from your Google Drive...');
                    remoteDeleteProject(oauth2Client, metadata.id, metadata.name, function(err, result) {
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
