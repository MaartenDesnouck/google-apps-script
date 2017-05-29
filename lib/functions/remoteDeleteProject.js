var google = require('googleapis');

/**
 * Delete a script file from Google Drive
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {string} fileId - Id of file to delete.
 * @param {string} name - Name of project we'ere deleting.
 * @param {callback} callback - The callback that handles the response.
 */
function deleteRemote(auth, fileId, name, callback) {
    var drive = google.drive('v3');
    drive.files.delete({
        auth: auth,
        fileId: fileId,
    }, callback);
}

module.exports = deleteRemote;
