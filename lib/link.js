var authenticate = require('./functions/authenticate.js');
var getMetadata = require('./functions/getMetadata.js');
var downloadRemote = require('./functions/downloadRemote.js');

/**
 * Link a new project to the current folder
 *
 * @param {string} fileId - Id of the remote project to link to the current folder.
 */
module.exports = function(fileId) {
    console.log('Linking remote project to this folder...');
    authenticate([], function(err, oauth2Client) {
        if (err) {
            console.log('gas returned an error: ' + err);
        } else {
            getMetadata(oauth2Client, fileId, function(err, kind, id, name, mimeType) {
                if (err) {
                    console.log('gas returned an error: ' + err);
                } else {
                    downloadRemote(oauth2Client, fileId, null, 'link', function(err) {
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
