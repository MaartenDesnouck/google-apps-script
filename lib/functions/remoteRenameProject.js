const google = require('googleapis');

/**
 * Rename a script file in Google Drive
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {string} fileId - Id of the script file to rename.
 * @param {string} name - Old name of the Google Apps Script file.
 * @param {string} newName - New name to give to the new Google Apps Script file.
 * @param {callback} callback - The callback that handles the response.
 */
function renameRemote(auth, fileId, name, newName, callback) {
    if (newName === name) {
        callback(null, null, true);
        return;
    }

    var drive = google.drive('v3');
    drive.files.update({
        auth: auth,
        fileId: fileId,
        resource: {
            name: newName
        },
    }, callback);
}

module.exports = renameRemote;
