var google = require('googleapis');
var fs = require('fs');
var constants = require('../constants.js');

var content = "{'files': [{'name': 'main', 'type': 'server_js', 'source': 'function myFunction() {\n\n}'}]}"

/**
 * Create a new script file in Google Drive
 *
 * @param {getEventsCallback} callback
 */
module.exports = function(oauth2Client, name, callback) {
    console.log('Creating new remote project...');
    var drive = google.drive('v3');
    var mimeType = 'application/vnd.google-apps.script+json'

    drive.files.create({
        auth: oauth2Client,
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
