const google = require('googleapis');

/**
 * Delete a script file from Google Drive
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {string} fileId - Id of file to delete.
 * @param {string} name - Name of project we'ere deleting.
 * @param {callback} callback - The callback that handles the response.
 * @returns {void}
 */
function deleteRemote(auth, fileId, name, callback) {
    const drive = google.drive('v3');
    const options = {
        auth,
        fileId,
    };

    drive.files.delete(options, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
    });
}

module.exports = deleteRemote;
