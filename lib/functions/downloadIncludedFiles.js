const google = require('googleapis');
const fs = require('fs');
const request = require('request');
const path = require('path');
const constants = require('../constants.js');

var includeDir = '';

/**
 * Download files specified by include file
 *
 * @param {array} included - An authorized OAuth2 client.
 * @param {string} dir - Directory in which the project is located.
 * @param {callback} callback - The callback that handles the response.
 * @return {void}
 */
function downloadIncludedFiles(included, dir, callback) {
    if (dir) {
        includeDir = path.join('.', dir, constants.INCLUDE_DIR);
    } else {
        includeDir = path.join('.', constants.INCLUDE_DIR);
    }

    // Create include folder if it doesn't exist yet
    try {
        if (!fs.existsSync(includeDir)) {
            fs.mkdirSync(includeDir);
        }

        // Create list of filenames
        let filenames = [];
        for (const includeFile of included) {
            filenames.push(includeFile[0]);
        }

        // Remove all files in includeDir not in includeFile
        const allFiles = fs.readdirSync(includeDir);
        let filesToDelete = [];
        for (const file of allFiles) {
            if (filenames.indexOf(file) < 0) {
                filesToDelete.push(path.join(includeDir, file));
            }
        }

        for (const fileToDelete of filesToDelete) {
            fs.unlinkSync(fileToDelete);
        }

        // Get and create/update the included files
        getAndWriteIncludedFiles(included, 0, [], [], callback);
        return;

    } catch (err) {
        callback(err);
        return;
    }
}

/**
 * Get and write all included files
 *
 * @param {object} files - Files to get and write.
 * @param {index} index - Index of the current file to get.
 * @param {callback} callback
 * @return {void}
 */
function getAndWriteIncludedFiles(files, index, failed, successful, callback) {
    if (index >= files.length) {
        callback(null, failed, successful);
        return;
    }

    const fileName = files[index][0];
    const fileURL = files[index][1];
    index += 1;

    const options = {
        url: fileURL,
        headers: {
            'User-Agent': 'request',
        }
    };

    request.get(options, (getErr, response, body) => {
        if (!getErr && response.statusCode === 200) {
            fs.writeFile(path.join(includeDir, fileName), body, (writeErr) => {
                if (!writeErr) {
                    successful.push(fileName);
                } else {
                    failed.push(fileName);
                }
                getAndWriteIncludedFiles(files, index, failed, successful, callback);
                return;
            });
        } else {
            failed.push(fileName);
            getAndWriteIncludedFiles(files, index, failed, successful, callback);
            return;
        }
    });
}

module.exports = downloadIncludedFiles;
