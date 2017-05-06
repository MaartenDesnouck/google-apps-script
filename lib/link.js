var authenticate = require('./functions/authenticate.js');
var getMetadata = require('./functions/getMetadata.js');
var downloadRemote = require('./functions/downloadRemote.js');

/**
 * Link a remote Google Apps Script project to the current folder
 *
 * @param {string} fileId - Id of the remote project to link to the current folder.
 */
module.exports = function(identifier) {
    authenticate([], function(err, oauth2Client) {
        if (err) {
            console.log('gas returned an error: ' + err);
        } else {
            getMetadata(oauth2Client, identifier, function(err, metadata) {
                if (err) {
                    console.log('gas returned an error: ' + err);
                } else {
                    downloadRemote(oauth2Client, metadata.id, null, 'link', function(err) {
                        if (err) {
                            console.log('gas returned an error: ' + err);
                        } else {
                            console.log('Succesfully linked remote project to this folder.');
                        }
                    });
                }
            });
        }
    });
}
