const authenticate = require('./functions/authenticate.js');
const getMetadata = require('./functions/getMetadata.js');
const remoteDeleteProject = require('./functions/remoteDeleteProject.js');
const handleError = require('./functions/handleError.js');
const colors = require('colors');
const readline = require('readline');

/**
 * Delete a Google Apps Script project from your Google Drive
 *
 * @param {string} fileId - Id of the remote project to link to the current folder.
 */
module.exports = function(identifier) {
    process.stdout.write('Deleting \'' + identifier + '\' from your Google Drive...');
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
                    process.stdout.write('Deleting \'' + metadata.name + '\' from your Google Drive...');
                    remoteDeleteProject(auth, metadata.id, metadata.name, function(err, result) {
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
