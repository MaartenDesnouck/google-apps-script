const authenticate = require('./functions/authenticate.js');
const getMetadata = require('./functions/getMetadata.js');
const remoteRenameProject = require('./functions/remoteRenameProject.js');
const handleError = require('./functions/handleError.js');
const colors = require('colors');
const readline = require('readline');

/**
 * Rename a Google Apps Script project from Google Drive
 *
 * @param {string} fileId - Id of the remote project to rename.
 * @param {string} newName - new name of the project.
 */
module.exports = function(identifier, newName) {
    process.stdout.write('Renaming project to \'' + newName + '\' in your Google Drive...');
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
                    process.stdout.write('Renaming \'' + metadata.name + '\' to \'' + newName + '\' in your Google Drive...');
                    remoteRenameProject(auth, metadata.id, metadata.name, newName, function(err, result, skipped) {
                        if (err) {
                            process.stdout.write(' [' + '✘'.red + ']\n');
                            handleError(auth, err);
                        } else if (result) {
                            process.stdout.write(' [' + '✔'.green + ']\n');
                        } else if (skipped) {
                            process.stdout.write(' [' + '✔'.yellow + ']\n');
                            process.stdout.write('Skipped renaming because old and new name appear to be the same\n');
                        }
                    });
                }
            });
        }
    });
}
