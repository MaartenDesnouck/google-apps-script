var authenticate = require('./functions/authenticate.js');
var getMetadata = require('./functions/getmetadata.js');
var remoteDeleteProject = require('./functions/remoteDeleteProject.js');
var handleError = require('./functions/handleError.js');

/**
 * Delete a Google Apps Script project from Google Drive
 *
 * @param {string} fileId - Id of the remote project to link to the current folder.
 */
module.exports = function(identifier) {
    authenticate([], function(err, oauth2Client) {
        if (err) {
            handleError(err);
        } else {
            getMetadata(oauth2Client, identifier, function(err, metadata) {
                if (err) {
                    handleError(err);
                } else {
                    remoteDeleteProject(oauth2Client, metadata.id, metadata.name, function(err, result) {
                        if (err) {
                            handleError(err);
                        } else {
                            console.log('Succesfully deleted \'' + metadata.name + '\' from your Google Drive');
                        }
                    });
                }
            });
        }
    });
}
