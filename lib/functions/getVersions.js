const google = require('googleapis');
const error = require('./error.js');
const triageGoogleError = require('./triageGoogleError.js');

/**
 * Push the local google script file back to Google Drive
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {String} scriptId - Id of the Google Apps Script project.
 * @returns {Promise} - A promise resolving no value
 */
function getVersions(auth, scriptId) {
    return new Promise((resolve, reject) => {
        const script = google.script('v1');
        script.projects.versions.list({
            auth,
            scriptId,
        }, (error, versions) => {
            if (error) {
                triageGoogleError(err, 'getVersions').then((triaged) => {
                    reject(triaged);
                }).catch((notTriaged) => {
                    reject(notTriaged);
                });
            } else {
                resolve(versions);
            }
            return;
        });
    });
}

module.exports = getVersions;
