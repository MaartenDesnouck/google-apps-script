const google = require('googleapis');
const fs = require('fs');
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
 * @param {callback} callback - The callback that handles the response.
 * @returns {void}
 */
function downloadRemote(auth, fileId, dir, method, callback) {
    const gasDir = dir ? path.join('.', dir, constants.META_DIR) : path.join('.', constants.META_DIR);

    switch (method) {
        case 'clone':
            if (fs.existsSync(path.join('.', dir))) {
                callback('Oops, the directory \'' + dir + '\' seems to exist already. \n' +
                    'Remove this folder or use \'gas link\' to link your project to the correct folder.');
                return;
            }
            break;
        case 'pull':
            break;
        case 'link':
            break;
        default:
            callback('Unsupported method.');
            return;
    }
    const file = {
        name: path.join(gasDir, constants.META_ID),
        source: fileId,
    };
    createFile(file);

    const dest = fs.createWriteStream(path.join(gasDir, constants.META_REMOTE));
    const drive = google.drive('v3');

    drive.files.export({
        auth,
        fileId,
        mimeType: constants.MIME_GAS_JSON,
    }, (err, result) => {
        if (err) {
            fs.unlinkSync(path.join(gasDir, constants.META_REMOTE));
            callback(err);
            return;
        }
    }).pipe(dest);

    dest.on('finish', () => {
        callback();
        return;
    });
}

module.exports = downloadRemote;
