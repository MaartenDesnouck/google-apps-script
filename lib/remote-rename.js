var authenticate = require('./functions/authenticate.js');
var getMetadata = require('./functions/getMetadata.js');
var remoteRenameProject = require('./functions/remoteRenameProject.js');
var handleError = require('./functions/handleError.js');
var colors = require('colors');
var readline = require('readline');

/**
 * Rename a Google Apps Script project from Google Drive
 *
 * @param {string} fileId - Id of the remote project to rename.
 * @param {string} newName - new name of the project.
 */
module.exports = function(identifier, newName) {
    process.stdout.write('Renaming project to \'' + newName + '\' in your Google Drive...');
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
                    process.stdout.write('Renaming \'' + metadata.name + '\' to \'' + newName + '\' in your Google Drive...');
                    remoteRenameProject(oauth2Client, metadata.id, metadata.name, newName, function(err, result, skipped) {
                        if (err) {
                            process.stdout.write(' [' + '✘'.red + ']\n');
                            handleError(err);
                        } else if (result) {
                            process.stdout.write(' [' +'✔'.green + ']\n');
                        } else if (skipped) {
                            process.stdout.write(' [' +'✔'.yellow + ']\n');
                            process.stdout.write('Skipped renaming because old and new name appear to be the same\n');
                        }
                    });
                }
            });
        }
    });
}
