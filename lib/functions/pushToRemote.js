const {
    google,
} = require('googleapis');
const fs = require('fs-extra');
const path = require('path');
const triageGoogleError = require('./triageGoogleError.js');
const constants = require('../constants.js');


/**
 * Push the local google script file back to remote
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {String} projectId - Id of the Google Apps Script project.
 * @param {String} type - Pushing local or remote.
 * @param {String} rootFolder - relative path to the rootFolder of the project
 * @returns {Promise} - A promise resolving no value
 */
function pushToRemote(auth, projectId, type, rootFolder) {
    return new Promise((resolve, reject) => {
        const epoch = Date.now();

        // Decide which file to send to remote
        let file;
        if (type === 'remote') {
            file = path.join(rootFolder, constants.META_DIR, constants.META_REMOTE);
        } else {
            file = path.join(rootFolder, constants.META_DIR, constants.META_LOCAL);
        }

        // Read the file we need to push
        const files = fs.readJsonSync(file, 'utf8').files;

        // Push resource to google drive
        const script = google.script('v1');
        script.projects.updateContent({
            auth,
            scriptId: projectId,
            resource: {
                files,
            },
        }, (err, result) => {
            if (err) {
                triageGoogleError(err, 'pushToRemote').then((triaged) => {
                    reject(triaged);
                }).catch((notTriaged) => {
                    reject(notTriaged);
                });
            } else {
                resolve(result.data);
            }
            return;
        });
    });
}

module.exports = pushToRemote;
