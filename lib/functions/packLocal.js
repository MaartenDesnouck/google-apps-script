const fs = require('fs-extra');
const path = require('path');
const createFile = require('./createFile.js');
const getAllFiles = require('./getAllFiles.js');
const constants = require('../constants.js');

/**
 * Getting the json form of a file.
 *
 * @param {string} file - Full filename of the file to process.
 * @param {string} nameWithoutExtension - fileName without extension.
 * @param {string} extension - Only the extension of the filename.
 * @returns {Promise} - Promise resolving the json form of the file
 */
function getFileJSON(file, nameWithoutExtension, extension) {
    return new Promise((resolve, reject) => {
        fs.stat(file, (err, stats) => {
            if (stats.isFile()) {
                // Read local javascript file
                fs.readFile(file, 'utf8', (err, source) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    const type = extension === '.js' ? 'server_js' : 'html';
                    const fileJSON = {
                        name: nameWithoutExtension,
                        type,
                        source,
                    };
                    resolve(fileJSON);
                    return;
                });
            } else {
                reject();
                return;
            }
        });
    });
}

/**
 * Pack all seperate .js files back into a raw google script file
 *
 * @returns {Promise} - A promise resolving no value
 */
function packLocal(rootFolder) {
    // Read every local file and create a correct local.json file
    return new Promise((resolve, reject) => {
        const files = getAllFiles(rootFolder);
        const promises = [];
        const filenames = [];

        for (const file of files) {
            const extension = path.parse(file).ext;
            const nameWithoutExtension = path.parse(file).name;
            const folder = path.parse(file).dir;

            // If extension is correct and fileName does not start with a dot
            if ((extension === '.js' || extension === '.html') && (nameWithoutExtension[0] !== '.')) {
                const filename = path.join(folder, nameWithoutExtension).replace(`\\`, `/`);
                if (filenames.includes(filename)) {
                    reject(`Can't construct a Google Apps Script project with files with the same name: '${filename}.*'`);
                    return;
                } else {
                    filenames.push(filename);
                    promises.push(getFileJSON(file, filename, extension));
                }
            }
        }

        // Reject if there are no correct files
        if (filenames.length === 0) {
            reject(`Can't construct a Google Apps Script project without .js or .html files.`);
            return;
        }

        // When all the files are read and have their json returned
        Promise.all(promises).then((values) => {
            // Construct a local.json file based on values and write that file
            const localJSON = {
                "files": values,
            };
            const file = {
                name: path.join(rootFolder, constants.META_DIR, constants.META_LOCAL),
                source: JSON.stringify(localJSON),
            };
            createFile(file);
            resolve();
            return;
        }).catch(() => {
            reject(`Could not construct a Google Apps Script project. Please try again.`);
            return;
        });
    });
}

module.exports = packLocal;
