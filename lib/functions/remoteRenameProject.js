const {
    google,
} = require('googleapis');
const triageGoogleError = require('./triageGoogleError.js');

/**
 * Rename a remote script file
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {String} projectId - Id of the script project to rename.
 * @param {String} name - Old name of the Google Apps Script project.
 * @param {String} newName - New name to give to the new Google Apps Script project.
 * @returns {Promise} A promise resolving a boolean wether we renamed or not
 */
function renameRemote(auth, projectId, name, newName) {
    return new Promise((resolve, reject) => {
        if (newName === name) {
            resolve(false);
            return;
        }

        const drive = google.drive('v3');
        drive.files.update({
            auth,
            supportsTeamDrives: true,
            fileId: projectId,
            resource: {
                name: newName,
            },
        }, (err, result) => {
            if (err) {
                triageGoogleError(err, 'remoteRenameProject').then((triaged) => {
                    reject(triaged);
                }).catch((notTriaged) => {
                    reject(notTriaged);
                });
            } else {
                resolve(true);
            }
            return;
        });
    });
}

module.exports = renameRemote;
