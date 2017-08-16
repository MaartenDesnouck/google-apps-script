const google = require('googleapis');
const fs = require('fs-extra');
const path = require('path');
const constants = require('../constants.js');

/**
 * Push the local google script file back to Google Drive
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {string} projectId - Id of the Google Apps Script project.
 * @param {string} type - Pushing local or remote.
 * @param {string} rootFolder - relative path to the rootFolder of the project
 * @returns {Promise} - A promise resolving no value
 */
function pushToRemote(auth, projectId, type, rootFolder) {
    return new Promise((resolve, reject) => {
        const epoch = Date.now();
        const placeholderContent1 = `{"files":[{"name":"_gas_placeholder_${epoch}-1","type":"server_js","source": "// Hey there, if you see this, something went wrong.\n// Please retry \'gas push\'."}]}`;
        const placeholderContent2 = `{"files":[{"name":"_gas_placeholder_${epoch}-2","type":"server_js","source": "// Hey there, if you see this, something went wrong.\n// Please retry \'gas push\'."}]}`;

        // Decide which file to send to remote
        let file;
        if (type === 'local') {
            file = path.join(rootFolder, constants.META_DIR, constants.META_LOCAL);
        } else {
            file = path.join(rootFolder, constants.META_DIR, constants.META_REMOTE);
        }

        fs.readFile(file, 'utf8', (err, content) => {
            if (err) {
                reject(err);
                return;
            }

            // We need to delete all the id's otherwise Google Drive is not happy
            const json = JSON.parse(content);
            for (const file of json.files) {
                Reflect.deleteProperty(file, 'id');
            }
            content = JSON.stringify(json);

            // We first write a placeholder to google apps script
            // This way we can write files in alphabetical order instead of created order
            const drive = google.drive('v3');

            // Push placeholder to remote
            drive.files.update({
                auth,
                fileId: projectId,
                media: {
                    body: placeholderContent1,
                    mimeType: constants.MIME_GAS_JSON,
                },
            }, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                } else {
                    // Push local to remote
                    drive.files.update({
                        auth,
                        fileId: projectId,
                        media: {
                            body: content,
                            mimeType: constants.MIME_GAS_JSON,
                        },
                    }, (error, result) => {
                        if (error) {
                            // Disaster recovery
                            drive.files.update({
                                auth,
                                fileId: projectId,
                                media: {
                                    body: placeholderContent2,
                                    mimeType: constants.MIME_GAS_JSON,
                                },
                            }, (err, result) => {
                                if (err) {
                                    reject(err);
                                    return;
                                } else {
                                    const remoteFile = path.join(rootFolder, constants.META_DIR, constants.META_REMOTE);
                                    fs.readFile(remoteFile, 'utf8', (err, content) => {
                                        if (err) {
                                            reject(err);
                                            return;
                                        } else {
                                            drive.files.update({
                                                auth,
                                                fileId: projectId,
                                                media: {
                                                    body: content,
                                                    mimeType: constants.MIME_GAS_JSON,
                                                },
                                            }, (err, result) => {
                                                if (err) {
                                                    reject(err);
                                                    return;
                                                } else {
                                                    reject(error);
                                                    return;
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            resolve();
                            return;
                        }
                    });
                }
            });
        });
    });
}

module.exports = pushToRemote;
