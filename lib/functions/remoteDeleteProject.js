const google = require('googleapis');

/**
 * Delete a script file from Google Drive
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {string} fileId - Id of file to delete.
 * @param {string} name - Name of project we'ere deleting.
 * @returns {Promise}
 */
function deleteRemote(auth, fileId, name) {
    return new Promise((resolve, reject) => {
        const drive = google.drive('v3');
        const options = {
            auth,
            fileId,
        };

        drive.files.delete(options, (err, result) => {
            if (err) {
                reject(err);
                return;
            } else {
                resolve(result);
                return;
            }
        });
    });
}

module.exports = deleteRemote;
