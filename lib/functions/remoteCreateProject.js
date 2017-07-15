const google = require('googleapis');
const fs = require('fs');
const constants = require('../constants.js');

const content = "{'files': [" +
    "{'name': 'main', 'type': 'server_js', 'source': 'function myFunction() {\n\n}'}" +
    "]}";

/**
 * Create a new script file in Google Drive
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {string} name - Name to give to the new Google Apps Script file.
 * @param {callback} callback - The callback that handles the response.
 * @returns {void}
 */
function remoteCreateProject(auth, name, callback) {
    const drive = google.drive('v3');
    const options = {
        auth,
        resource: {
            name,
            mimeType: constants.MIME_GAS_JSON,
        },
        media: {
            mimeType: constants.MIME_GAS_JSON,
            body: content,
        },
    };

    drive.files.create(options, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
    });
}

module.exports = remoteCreateProject;
