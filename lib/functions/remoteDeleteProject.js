const {
    google,
} = require('googleapis');
const triageGoogleError = require('./triageGoogleError.js');

/**
 * Delete a remote script file
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
            supportsTeamDrives: true,
            fileId: projectId,
        };

        drive.files.delete(options, (err, result) => {
            if (err) {
                triageGoogleError(err, 'remoteDeleteProject').then((triaged) => {
                    reject(triaged);
                }).catch((notTriaged) => {
                    reject(notTriaged);
                });
            } else {
                resolve(result.data);
                return;
            }
            return;
        });
    });
}

module.exports = deleteRemote;
