const google = require('googleapis');
const fs = require('fs-extra');
const path = require('path');
const createFile = require('./createFile.js');
const constants = require('../constants.js');

/**
 * Download script json from Google Drive
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {string} fileId - Id of file to download.
 * @param {string} dir - Optional directory in which the project is located.
 * @param {string} method - Identifier for the flow calling this function.
 * @returns {Promise} - A promise resolving no value
 */
function downloadRemote(auth, fileId, dir, method) {
    return new Promise((resolve, reject) => {
        const gasDir = path.join('.', dir, constants.META_DIR);

        switch (method) {
            case 'clone':
                if (fs.existsSync(path.join('.', dir))) {
                    reject(`Oops, the directory '${dir}' seems to exist already.\nRemove this folder or use 'gas link' to link your project to the correct folder.`);
                    return;
                }
                break;
            case 'pull':
                break;
            case 'link':
                break;
            default:
                reject(`Unsupported method.`);
                return;
        }
        const file = {
            name: path.join(gasDir, constants.META_ID),
            source: fileId,
        };
        createFile(file);

        const remote = path.join(gasDir, constants.META_REMOTE);
        const drive = google.drive('v3');

        drive.files.export({
            auth,
            fileId,
            mimeType: constants.MIME_GAS_JSON,
        }, (err, content) => {
            if (err) {
                fs.unlinkSync(remote);
                reject(err);
                return;
            } else {
                createFile({
                    name: remote,
                    source: JSON.stringify(content),
                });
                resolve();
            }
        });
    });
}

module.exports = downloadRemote;
