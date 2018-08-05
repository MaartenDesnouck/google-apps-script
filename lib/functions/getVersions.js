const {
    google,
} = require('googleapis');
const triageGoogleError = require('./triageGoogleError.js');

/**
 * Push the local google script file back to remote project
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {String} projectId - Id of the Google Apps Script project.
 * @returns {Promise} - A promise resolving no value
 */
function getVersions(auth, projectId) {
    return new Promise((resolve, reject) => {
        const script = google.script('v1');
        script.projects.versions.list({
            auth,
            scriptId: projectId,
        }, (error, versions) => {
            if (error) {
                triageGoogleError(error, 'getVersions').then((triaged) => {
                    reject(triaged);
                }).catch((notTriaged) => {
                    reject(notTriaged);
                });
            } else {
                resolve(versions.data);
            }
            return;
        });
    });
}

module.exports = getVersions;
