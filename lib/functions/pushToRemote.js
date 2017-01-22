var google = require('googleapis');
var fs = require('fs');
var constants = require('../constants.js');

/**
 * Push the local google script file bach to Google Drive
 *
 * @param {getEventsCallback} callback
 */
module.exports = function(oauth2Client, fileId, callback) {
    var local = constants.META_DIR + constants.META_LOCAL;
    var remote = constants.META_DIR + constants.META_REMOTE;

    fs.readFile(local, 'utf8', function(err, content) {
        if (err) {
            callback(err);
        }

        var drive = google.drive('v3');
        drive.files.update({
            auth: oauth2Client,
            fileId: fileId,
            media: {
                body: content,
                mimeType: 'application/vnd.google-apps.script+json'
            },

        }, callback);
    });
}
