const google = require('googleapis');

/**
 * Rename a script file in Google Drive
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {string} fileId - Id of the script file to rename.
 * @param {string} name - Old name of the Google Apps Script file.
 * @param {string} newName - New name to give to the new Google Apps Script file.
 * @returns {Promise} A promise resolving a boolean wether we renamed or not
 */
function renameRemote(auth, fileId, name, newName) {
    return new Promise((resolve, reject) => {
        if (newName === name) {
            resolve(false);
            return;
        }

        const drive = google.drive('v3');
        drive.files.update({
            auth,
            fileId,
            resource: {
                name: newName,
            },
        }, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

module.exports = renameRemote;
