const google = require('googleapis');
const constants = require('../constants.js');

/**
 * Create a new folder in Google Drive
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {callback} callback - The callback that handles the response.
 * @return {void}
 */
function remoteCreateFolder(auth, callback) {
    const drive = google.drive('v3');
    drive.files.create({
        auth,
        resource: {
            name,
            mimeType: constants.MIME_GAF,
        },
        fields: 'id',
    }, callback);
}

module.exports = remoteCreateFolder;
