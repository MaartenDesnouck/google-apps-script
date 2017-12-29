const google = require('googleapis');

/**
 * Delete a script file from Google Drive
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {String} projectId - Id of file to delete.
 * @param {String} name - Name of project we'ere deleting.
 * @returns {Promise} - A promise resolving the metadata of the deleted project
 */
function deleteRemote(auth, projectId, name) {
    return new Promise((resolve, reject) => {
        const drive = google.drive('v3');
        const options = {
            auth,
            fileId: projectId,
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
