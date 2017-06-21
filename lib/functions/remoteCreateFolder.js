const google = require('googleapis');
const constants - require('../constants.js');

module.exports = function create() {
    authenticate(create_folder);
}

/**
 * Create a new folder in Google Drive
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {callback} callback - The callback that handles the response.
 */
function remoteCreateFolder(auth, callback) {
    var drive = google.drive('v3');
    drive.files.create({
        auth: auth,
        resource: {
            name: name,
            mimeType: constants.MIME_GAF
        },
        fields: 'id'
    }, callback);
}

module.exports = remoteCreateFolder;
