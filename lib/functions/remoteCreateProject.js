const google = require('googleapis');
const fs = require('fs');
const constants = require('../constants.js');

const content = "{'files': [" +
    "{'name': 'main', 'type': 'server_js', 'source': 'function myFunction() {\n\n}'}" +
    "]}"

/**
 * Create a new script file in Google Drive
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {string} name - Name to give to the new Google Apps Script file.
 * @param {callback} callback - The callback that handles the response.
 */
function remoteCreateProject(auth, name, callback) {
    var drive = google.drive('v3');

    drive.files.create({
        auth: auth,
        resource: {
            name: name,
            mimeType: constants.MIME_GAS_JSON
        },
        media: {
            mimeType: constants.MIME_GAS_JSON,
            body: content
        }
    }, callback);
}

module.exports = remoteCreateProject;
