const google = require('googleapis');
const constants = require('../constants.js');

/**
 * Create a new folder in Google Drive
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {callback} callback - The callback that handles the response.
 * @returns {void}
 */
function remoteCreateFolder(auth, callback) {
    return new Promise((resolve, reject) => {
        const drive = google.drive('v3');
        const options = {
            auth,
            resource: {
                name,
                mimeType: constants.MIME_GAF,
            },
            fields: 'id',
        };

        drive.files.create(options, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = remoteCreateFolder;
