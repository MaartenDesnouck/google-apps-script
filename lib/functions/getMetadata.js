var google = require('googleapis');
var fs = require('fs');
var constants = require('../constants.js');

/**
 * Get the metadata of a file with a given id
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {string} fileId - Id of the file we want to get the metadata from.
 * @param {callback} callback
 */
module.exports = function(auth, fileId, callback) {
    var drive = google.drive('v3');
    drive.files.get({
        auth: auth,
        fileId: fileId,
        mimeType: 'application/vnd.google-apps.script+json'
    }, function(err, result) {
        if (err) {
            fs.unlink(gasDir + constants.META_REMOTE, function() {});
            callback(err);
        } else {
            callback(null, result.kind, result.id, result.name, result.mimeType);
        }
    });
}
