var authenticate = require('./functions/authenticate.js');
var getMetadata = require('./functions/getmetadata.js');
var remoteRenameProject = require('./functions/remoteRenameProject.js');
var handleError = require('./functions/handleError.js');

/**
 * Rename a Google Apps Script project from Google Drive
 *
 * @param {string} fileId - Id of the remote project to rename.
 * @param {string} newName - new name of the project.
 */
module.exports = function(identifier, newName) {
    authenticate([], function(err, oauth2Client) {
        if (err) {
            handleError(err);
        } else {
            getMetadata(oauth2Client, identifier, function(err, metadata) {
                if (err) {
                    handleError(err);
                } else {
                    remoteRenameProject(oauth2Client, metadata.id, metadata.name, newName, function(err, result, skipped) {
                        if (err) {
                            handleError(err);
                        } else if (result) {
                            console.log('Succesfully renamed \'' + metadata.name + '\' to \'' + newName + '\' in your Google Drive');
                        } else {
                            console.log('Skipped renaming because old and new name appear to be the same');
                        }
                    });
                }
            });
        }
    });
}
