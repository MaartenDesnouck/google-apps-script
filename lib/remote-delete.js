var authenticate = require('./functions/authenticate.js');
var getMetadata = require('./functions/getmetadata.js');
var remoteDeleteProject = require('./functions/remoteDeleteProject.js');

/**
 * Delete a Google Apps Script project from Google Drive
 *
 * @param {string} fileId - Id of the remote project to link to the current folder.
 */
module.exports = function(identifier) {
    authenticate([], function(err, oauth2Client) {
        if (err) {
            console.log('gas returned an error: ' + err);
        } else {
            getMetadata(oauth2Client, identifier, function(err, id, name, mimeType) {
                if (err) {
                    console.log('gas returned an error: ' + err);
                } else {
                    remoteDeleteProject(oauth2Client, id, name, function(err, result) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Succesfully deleted \'' + name + '\' from your Google Drive');
                        }
                    });
                }
            });
        }
    });
}
