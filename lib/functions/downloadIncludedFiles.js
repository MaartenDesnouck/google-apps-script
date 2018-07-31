const {
    google,
} = require('googleapis');
const fs = require('fs-extra');
const request = require('request');
const path = require('path');
const constants = require('../constants.js');

/**
 * Get and write all included files
 *
 * @param {Object} file - File to get and write.
 * @param {String} includeDir - Where to write the included files.
 * @returns {Promise} - Promise resolving an object with the fileName and if include was successful
 */
function getAndWriteIncludedFile(file, includeDir) {
    return new Promise((resolve, reject) => {
        const fileName = file[0];
        const fileURL = file[1];

        const options = {
            url: fileURL,
            headers: {
                'User-Agent': 'request',
            },
        };

        request.get(options, (err, response, body) => {
            if (!err && response.statusCode === 200) {
                fs.writeFile(path.join(includeDir, fileName), body, (writeErr) => {
                    if (writeErr) {
                        resolve({
                            fileName,
                            successful: false,
                        });
                    } else {
                        resolve({
                            fileName,
                            successful: true,
                        });
                    }
                    return;
                });
            } else {
                resolve({
                    fileName,
                    successful: false,
                });
                return;
            }
        });
    });
}

/**
 * Download files specified by include file
 *
 * @param {array} included - An authorized OAuth2 client.
 * @param {String} dir - Directory in which the project is located.
 * @returns {Promise} - Promise resolving
 */
function downloadIncludedFiles(included, dir) {
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
                fs.removeSync(fileToDelete);
            }

            // Download all the files
            const promises = [];
            for (const file of included) {
                promises.push(getAndWriteIncludedFile(file, includeDir));
            }
            Promise.all(promises).then((values) => {
                const failed = [];
                const successful = [];
                for (const value of values) {
                    if (value.successful) {
                        successful.push(value.fileName);
                    } else {
                        failed.push(value.fileName);
                    }
                }
                resolve({
                    failed,
                    successful,
                });
            });
        } catch (err) {
            reject(err);
            return;
        }
    });
}

module.exports = downloadIncludedFiles;
