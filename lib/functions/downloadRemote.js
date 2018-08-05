const {
    google,
} = require('googleapis');
const fs = require('fs-extra');
const path = require('path');
const triageGoogleError = require('./triageGoogleError.js');
const createFile = require('./createFile.js');
const constants = require('../constants.js');

/**
 * Download remote script json
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {String} projectId - Id of project to download.
 * @param {String} dir - Optional directory in which the project is located.
 * @param {String} method - Identifier for the flow calling this function.
 * @returns {Promise} - A promise resolving no value
 */
function downloadRemote(auth, projectId, dir, method) {
    return new Promise((resolve, reject) => {
        const gasDir = path.join('.', dir, constants.META_DIR);

        if (method === 'clone' && fs.existsSync(path.join('.', dir))) {
            reject({
                message: `Oops, the directory '${dir}' seems to exist already.\nRemove this folder or use 'gas link' to link your project to the correct folder.`,
                print: true,
            });
            return;
        }

        const file = {
            name: path.join(gasDir, constants.META_ID),
            source: projectId,
        };
        createFile(file);

        const remote = path.join(gasDir, constants.META_REMOTE);
        const script = google.script('v1');

        script.projects.getContent({
            auth,
            scriptId: projectId,
        }, (err, content) => {
            if (err) {
                fs.removeSync(remote);
                triageGoogleError(err, 'downloadRemote').then((triaged) => {
                    reject(triaged);
                }).catch((notTriaged) => {
                    reject(notTriaged);
                });
            } else {
                createFile({
                    name: remote,
                    source: JSON.stringify(content.data),
                });
                resolve();
            }
            return;
        });
    });
}

module.exports = downloadRemote;
