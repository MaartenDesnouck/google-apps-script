var authenticate = require('./functions/authenticate.js');
var createNewRemote = require('./functions/createNewRemote.js');
var clone = require('./clone.js');

/**
 * Delete a Google Apps Script project from Google Drive
 *
 * @param {string} fileId - Id of the remote project to link to the current folder.
 */
module.exports = function(fileId) {
    authenticate([], function(err, oauth2Client) {
        if (err) {
            console.log('gas returned an error: ' + err);
        } else {
            // TODO
            console.log('This function has not been implemented yet.');
        }
    });
}
