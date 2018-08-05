const {
    google,
} = require('googleapis');
const triageGoogleError = require('./triageGoogleError.js');

/**
 * Push the local google script file back to remote
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {String} projectId - Id of the Google Apps Script project.
 * @returns {Promise} - A promise resolving no value
 */
function getDeployments(auth, projectId) {
    return new Promise((resolve, reject) => {
        const script = google.script('v1');
        script.projects.deployments.list({
            auth,
            scriptId: projectId,
        }, (error, deployments) => {
            if (error) {
                triageGoogleError(error, 'getDeployments').then((triaged) => {
                    reject(triaged);
                }).catch((notTriaged) => {
                    reject(notTriaged);
                });
            } else {
                resolve(deployments.data);
            }
            return;
        });
    });
}

module.exports = getDeployments;
