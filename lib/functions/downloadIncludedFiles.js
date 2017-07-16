const google = require('googleapis');
const fs = require('fs');
const request = require('request');
const path = require('path');
const constants = require('../constants.js');

/**
 * Get and write all included files
 *
 * @param {object} files - Files to get and write.
 * @param {index} index - Index of the current file to get.
 * @param {string} includeDir - Files to get and write.
 * @param {object} failed - List of failed files.
 * @param {object} succesful - List of succesful files.
 * @returns {Promise} - Promise resolving an object with lists of failed and successfull includes
 */
function getAndWriteIncludedFiles(files, index, includeDir, failed, successful) {
    return new Promise((resolve, reject) => {
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
            },
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
    });
}

/**
 * Download files specified by include file
 *
 * @param {array} included - An authorized OAuth2 client.
 * @param {string} dir - Directory in which the project is located.
 * @returns {Promise} - Promise resolving
 */
function downloadIncludedFiles(included, dir, callback) {
    return new Promise((resolve, reject) => {
        const includeDir = dir ? path.join('.', dir, constants.INCLUDE_DIR) : path.join('.', constants.INCLUDE_DIR);

        // Create include folder if it doesn't exist yet
        try {
            if (!fs.existsSync(includeDir)) {
                fs.mkdirSync(includeDir);
            }

            // Create list of filenames
            const filenames = [];
            for (const includeFile of included) {
                filenames.push(includeFile[0]);
            }

            // Remove all files in includeDir not in includeFile
            const allFiles = fs.readdirSync(includeDir);
            const filesToDelete = [];
            for (const file of allFiles) {
                if (filenames.indexOf(file) < 0) {
                    filesToDelete.push(path.join(includeDir, file));
                }
            }

            for (const fileToDelete of filesToDelete) {
                fs.unlinkSync(fileToDelete);
            }

            // Get and create/update the included files
            getAndWriteIncludedFiles(included, 0, includeDir, [], [], callback);
            return;

        } catch (err) {
            callback(err);
            return;
        }
    });
}

module.exports = downloadIncludedFiles;
