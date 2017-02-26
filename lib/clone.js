var authenticate = require('./functions/authenticate.js');
var downloadRemote = require('./functions/downloadRemote.js')
var unpackRemote = require('./functions/unpackRemote.js');
var getMetadata = require('./functions/getMetadata.js');

/**
 * Clone a remote Google Apps Script project
 *
 * @param {string} fileId - Id of the project we want to clone.
 * @param {callback} callback
 */
module.exports = function(fileId, callback) {
    console.log('Cloning project from Google Drive...');
    authenticate([], function(err, oauth2Client) {
        if (err) {
            console.log('gas returned an error: ' + err);
        } else {
            getMetadata(oauth2Client, fileId, function(err, kind, id, name, mimeType) {
                if (err) {
                    console.log('gas returned an error: ' + err);
                } else {
                    downloadRemote(oauth2Client, fileId, name, 'clone', function(err) {
                        if (err) {
                            console.log('gas returned an error: ' + err);
                        } else {
                            unpackRemote(name, function(err) {
                                if (err) {
                                    console.log('gas returned an error: ' + err);
                                } else {
                                    console.log('Succesfully cloned from Google Drive.');
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};
