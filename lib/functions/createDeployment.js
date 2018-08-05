const {
    google,
} = require('googleapis');
const triageGoogleError = require('./triageGoogleError.js');


/**
 * Create a new version for a script
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {String} projectId - Id of the Google Apps Script project.
 * @param {String} versionNumber - Version to deploy.
 * @param {String} description - Description to give to the deployment.
 * @returns {Promise} - A promise resolving no value
 */
function createDeployment(auth, projectId, versionNumber, description) {
    return new Promise((resolve, reject) => {
        const script = google.script('v1');
        script.projects.deployments.create({
            auth,
            scriptId: projectId,
            resource: {
                versionNumber,
                manifestFileName: 'appsscript',
                description,
            },
        }, (err, res) => {
            if (err) {
                triageGoogleError(err, 'createDeployment').then((triaged) => {
                    reject(triaged);
                }).catch((notTriaged) => {
                    reject(notTriaged);
                });
            } else {
                resolve(res.data);
            }
            return;
        });
    });
}

module.exports = createDeployment;
