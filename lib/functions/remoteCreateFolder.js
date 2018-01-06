const google = require('googleapis');
const constants = require('../constants.js');
const triageGoogleError = require('./triageGoogleError.js');

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
                triageGoogleError(err, 'remoteCreateFolder').then((triaged) => {
                    reject(triaged);
                }).catch((notTriaged) => {
                    reject(notTriaged);
                });
            } else {
                resolve(result);
            }
            return;
        });
    });
}

module.exports = remoteCreateFolder;
