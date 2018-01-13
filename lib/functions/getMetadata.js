const google = require('googleapis');
const triageGoogleError = require('./triageGoogleError.js');

/**
 * Get the metadata of a file with a given id
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {String} scriptId - id we want to get metadata from.
 * @returns {Promose} - promise resolving the metadata of the project
 */
function getMetadata(auth, scriptId) {
    return new Promise((resolve, reject) => {
        const script = google.script('v1');
        script.projects.get({
            auth,
            scriptId,
        }, (err, result) => {
            if (err) {
                triageGoogleError(err, 'getMetadata').then((triaged) => {
                    reject(triaged);
                }).catch((notTriaged) => {
                    reject(notTriaged);
                });
            } else {
                resolve(result);
            }
            return;
        });
    });
}

module.exports = getMetadata;
