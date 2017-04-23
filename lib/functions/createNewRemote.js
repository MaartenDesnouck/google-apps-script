var google = require('googleapis');
var fs = require('fs');
var constants = require('../constants.js');

var content = "{'files': [{'name': 'main', 'type': 'server_js', 'source': 'function myFunction() {\n\n}'}]}"

/**
 * Create a new script file in Google Drive
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {string} name - Name to give to the new Google Apps Script file.
 * @param {callback} callback - The callback that handles the response.
 */
function createNewRemote(auth, name, callback) {
    console.log('Creating new project in your Google Drive...');
    var drive = google.drive('v3');
    var mimeType = 'application/vnd.google-apps.script+json'

    drive.files.create({
        auth: auth,
        resource: {
            name: name,
            mimeType: mimeType
        },
        media: {
            mimeType: mimeType,
            body: content
        }
    }, callback);
}

module.exports = createNewRemote;
