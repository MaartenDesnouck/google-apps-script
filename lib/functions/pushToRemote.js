const google = require('googleapis');
const fs = require('fs');
const path = require('path');
const constants = require('../constants.js');

const epoch = Date.now();
const placeholderContent = '{"files":[{"name":"_gas_placeholder_' + epoch +
    '","type":"server_js","source": "// Hey there, if you see this, something went wrong.\n// Please retry \'gas push\'."}]}';

/**
 * Push the local google script file back to Google Drive
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {string} fileId - Id of the Google Apps Script project.
 * @param {callback} callback - The callback that handles the response.
 */
function pushToRemote(auth, fileId, callback) {
    var local = path.join(constants.META_DIR, constants.META_LOCAL);
    var remote = path.join(constants.META_DIR, constants.META_REMOTE);

    fs.readFile(local, 'utf8', (err, content) => {
        if (err) {
            callback(err);
        }

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
        }, () => {
            drive.files.update({
                auth: auth,
                fileId: fileId,
                media: {
                    body: content,
                    mimeType: constants.MIME_GAS_JSON
                },
            }, callback);
        });
    });
}

module.exports = pushToRemote;
