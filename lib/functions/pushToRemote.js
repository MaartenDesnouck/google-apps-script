var google = require('googleapis');
var fs = require('fs');
var constants = require('../constants.js');

/**
 * Push the local google script file bach to Google Drive
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {string} fileId - Id of the Google Apps Script project.
 * @param {callback} callback - The callback that handles the response.
 */
function pushToRemote(auth, fileId, callback) {
    var local = constants.META_DIR + '/' + constants.META_LOCAL;
    var remote = constants.META_DIR + '/' + constants.META_REMOTE;

    fs.readFile(local, 'utf8', function(err, content) {
        if (err) {
            callback(err);
        }

        var drive = google.drive('v3');
        drive.files.update({
            auth: auth,
            fileId: fileId,
            media: {
                body: content,
                mimeType: constants.MIME_GAS_JSON
            },

        }, callback);
    });
}

module.exports = pushToRemote;
