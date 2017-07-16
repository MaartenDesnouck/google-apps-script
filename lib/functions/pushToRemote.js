const google = require('googleapis');
const fs = require('fs');
const path = require('path');
const constants = require('../constants.js');

/**
 * Push the local google script file back to Google Drive
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {string} fileId - Id of the Google Apps Script project.
 * @param {callback} callback - The callback that handles the response.
 * @returns {Promise} - A promise resolving no value
 */
function pushToRemote(auth, fileId, type) {
    return new Promise((resolve, reject) => {
        const epoch = Date.now();
        const placeholderContent = `{"files":[{"name":"_gas_placeholder_${epoch}","type":"server_js","source": "// Hey there, if you see this, something went wrong.\n// Please retry \'gas push\'."}]}`;
        let file;

        // Decide which file to send to remote
        if (type === 'local') {
            file = path.join(constants.META_DIR, constants.META_LOCAL);
        } else {
            file = path.join(constants.META_DIR, constants.META_REMOTE);
        }

        fs.readFile(file, 'utf8', (err, content) => {
            if (err) {
                reject(err);
                return;
            }

            // We need to delete all the id's otherwise Google Drive is not happy
            json = JSON.parse(content);
            for (file in json.files) {
                //console.log(json.files[file]);
                delete json.files[file].id;
            }
            content = JSON.stringify(json);

            // We first write a placeholder to google apps script
            // This way we can write files in alphabetical order instead of created order
            const drive = google.drive('v3');

            // Push local to remote
            drive.files.update({
                auth,
                fileId,
                media: {
                    body: placeholderContent,
                    mimeType: constants.MIME_GAS_JSON,
                },
            }, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                } else {
                    drive.files.update({
                        auth,
                        fileId,
                        media: {
                            body: content,
                            mimeType: constants.MIME_GAS_JSON,
                        },
                    }, (err, result) => {
                        if (err) {
                            reject(err);
                            return;
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
