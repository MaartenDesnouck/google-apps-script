const fs = require('fs-extra');
const path = require('path');
const createFile = require('./createFile.js');
const getAllFiles = require('./getAllFiles.js');
const constants = require('../constants.js');

/**
 * Getting the json form of a file.
 *
 * @param {string} rootFolder - relative path to the rootFOldr of the project.
 * @param {string} file - Full filename of the file to process.
 * @param {string} fileName - fileName without extension.
 * @param {string} extension - Only the extension of the filename.
 * @returns {Promise} - Promise resolving the json form of the file
 */
function getFileJSON(rootFolder, file, fileName, extension) {
    return new Promise((resolve, reject) => {
        fs.stat(path.join(rootFolder, file), (err, stats) => {
            if (err) {
                reject();
                return;
            }
            if (stats.isFile()) {
                // Read local javascript file
                fs.readFile(path.join(rootFolder, file), 'utf8', (err, source) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    const type = extension === '.js' ? 'server_js' : 'html';
                    const fileJSON = {
                        name: fileName,
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
 * @param {string} rootFolder - relative path to the rootFolder of the project
 * @returns {Promise} - A promise resolving no value
 */
function packLocal(rootFolder) {
    // Read every local file and create a correct local.json file
    return new Promise((resolve, reject) => {
        const files = getAllFiles(rootFolder, '.');
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
                    promises.push(getFileJSON(rootFolder, file, filename, extension));
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
