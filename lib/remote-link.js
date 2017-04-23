var authenticate = require('./functions/authenticate.js');
var getMetadata = require('./functions/getMetadata.js');
var downloadRemote = require('./functions/downloadRemote.js');

/**
 * Link a new project to the current folder
 *
 * @param {string} fileId - Id of the remote project to link to the current folder.
 */
module.exports = function(fileId) {
    console.log('Linking remote project...');
    authenticate([], function(err, oauth2Client) {
        if (err) {
            console.log('gas returned an error: ' + err);
        } else {
            // TODO Remove .gas folder if it exists
            getMetadata(oauth2Client, fileId, function(err, kind, id, name, mimeType) {
                if (err) {
                    console.log('gas returned an error: ' + err);
                } else {
                    downloadRemote(oauth2Client, fileId, null, 'clone', function(err) {
                        if (err) {
                            console.log('gas returned an error: ' + err);
                        } else {
                            // TODO  explain you should either gas push or gas pull after this command ?
                            console.log('Succesfully linked remote project to this folder.');
                        }
                    });
                }
            });
        }
    });
}
