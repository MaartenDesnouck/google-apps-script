var google = require('googleapis');
var fs = require('fs');
var constants = require('../constants.js');
var sanitize = require('sanitize-filename');

/**
 * Get the metadata of a file with a given id
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {string} fileId - Id of the file we want to get the metadata from.
 * @param {callback} callback
 */
function getMetadata(auth, fileId, callback) {
    var drive = google.drive('v3');
    drive.files.get({
        auth: auth,
        fileId: fileId,
        mimeType: constants.MIME_GAS_JSON
    }, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.kind, result.id, sanitize(result.name), result.mimeType);
        }
    });
}

module.exports = getMetadata;
