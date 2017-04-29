var google = require('googleapis');

/**
 * Create a new script file in Google Drive
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {string} name - Name to give to the new Google Apps Script file.
 * @param {callback} callback - The callback that handles the response.
 */
function renameRemote(auth, fileId, name, newName, callback) {
    if (newName === name) {
        callback(null, null, true);
        return;
    }

    if (name) {
        console.log('Renaming \'' + name + '\' in your Google Drive...');
    } else {
        console.log('Renaming a project in your Google Drive...');
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
