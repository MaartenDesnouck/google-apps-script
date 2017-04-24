var google = require('googleapis');

/**
 * Create a new script file in Google Drive
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {string} name - Name to give to the new Google Apps Script file.
 * @param {callback} callback - The callback that handles the response.
 */
function deleteRemote(auth, fileId, name, callback) {
    if (name) {
        console.log('Deleting \'' + name + '\' from your Google Drive...');
    } else {
        console.log('Deleting a project from your Google Drive...');
    }
    var drive = google.drive('v3');
    var mimeType = 'application/vnd.google-apps.script+json'

    drive.files.delete({
        auth: auth,
        fileId: fileId,
    }, callback);
}

module.exports = deleteRemote;
