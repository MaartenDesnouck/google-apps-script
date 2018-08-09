const {
    google,
} = require('googleapis');
const triageGoogleError = require('./triageGoogleError.js');

/**
 * Create a new remote script file
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {String} name - Name to give to the new Google Apps Script file.
 * @returns {Promise} - A promise resolving the metadata of the newly created project
 */
function remoteCreateProject(auth, name) {
    return new Promise((resolve, reject) => {
        const script = google.script('v1');
        script.projects.create({
            auth,
            title: name,
        }, (err, res) => {
            if (err) {
                triageGoogleError(err, 'remoteCreateProject').then((triaged) => {
                    reject(triaged);
                }).catch((notTriaged) => {
                    reject(notTriaged);
                });
            } else {
                resolve(res.data);
                return;
            }
            return;
        });
    });
}

module.exports = remoteCreateProject;
