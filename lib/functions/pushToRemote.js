var google = require('googleapis');
var fs = require('fs');
var constants = require('../constants.js');

/**
 * Push the local google script file back to Google Drive
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

        epoch = (new Date).getTime();
        placeholderContent = '{"files":[{"name":"_gas_placeholder_' + epoch +
        '","type":"server_js","source": "// Hey there, if you see this, something went wrong.\n// Please retry \'gas push\'."}]}';

        // We first write a placeholder to google apps script
        // This way we can write files in alphabetical order instead of created order
        var drive = google.drive('v3');
        drive.files.update({
            auth: auth,
            fileId: fileId,
            media: {
                body: placeholderContent,
                mimeType: constants.MIME_GAS_JSON
            },
        }, function() {
            drive.files.update({
                auth: auth,
                fileId: fileId,
                media: {
                    body: content,
                    mimeType: constants.MIME_GAS_JSON
                },
            }, callback)
        });
    });
}

module.exports = pushToRemote;
