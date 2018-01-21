const google = require('googleapis');
const constants = require('../constants.js');

/**
 * Create a new folder in Google Drive
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @returns {Promise} - A promise resolving the metadata of the newly created folder
 */
function remoteCreateFolder(auth) {
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
                return;
            } else {
                resolve(result.data);
                return;
            }
        });
    });
}

module.exports = remoteCreateFolder;
