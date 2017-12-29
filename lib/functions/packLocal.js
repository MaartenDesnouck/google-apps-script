const fs = require('fs-extra');
const path = require('path');
const createFile = require('./createFile.js');
const getAllFiles = require('./getAllFiles.js');
const eaft = require('./extensionAndFiletype.js');
const constants = require('../constants.js');

/**
 * Getting the json form of a file.
 *
 * @param {String} rootFolder - relative path to the rootFOldr of the project.
 * @param {String} file - Full filename of the file to process.
 * @param {String} fileName - fileName without extension.
 * @param {String} extension - Only the extension of the filename.
 * @param {String} id - Optional id of the file in the remote project.
 * @returns {Promise} - Promise resolving the json form of the file
 */
function getFileJSON(rootFolder, file, fileName, extension, id) {
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

                    const type = eaft.getFiletypeFromExtension(extension);
                    const fileJSON = {
                        name: fileName,
                        type,
                        source,
                        id,
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
 * @param {String} rootFolder - relative path to the rootFolder of the project
 * @param {Boolean} publish - iNdicates whether we are packing to publish
 * @returns {Promise} - A promise resolving no value
 */
function packLocal(rootFolder, publish) {
    // Read every local file and create a correct json file in .gas/${destination}
    return new Promise((resolve, reject) => {
        let destination;
        if (publish) {
            destination = constants.META_PUBLISH;
        } else {
            destination = constants.META_LOCAL;
        }
        const files = getAllFiles(rootFolder, '.');
        const remote = path.join(rootFolder, constants.META_DIR, constants.META_REMOTE);
        const promises = [];
        const filenames = [];

        // Get valid extensions for code files
        const extensions = eaft.getCodeExtensions();

        // Construct name to remote id map
        const remoteSource = fs.readJsonSync(remote, 'utf8');
        const filenameToRemoteIdMap = {};
        for (const remoteFile of remoteSource.files) {
            filenameToRemoteIdMap[remoteFile.name] = remoteFile.id;
        }

        // Check for all files in the root folder and all its subfolders if they are pushable
        for (const file of files) {
            const extension = path.parse(file).ext;
            const nameWithoutExtension = path.parse(file).name;
            const folder = path.parse(file).dir;

            // If extension is correct and fileName does not start with a dot
            if (eaft.isPushable(extension, nameWithoutExtension, extensions)) {
                const filename = path.join(folder, nameWithoutExtension).replace(`\\`, `/`);
                if (filenames.includes(filename)) {
                    reject({
                        message: `Can't construct a Google Apps Script project with files with the same name: '${filename}.*'`,
                        print: true,
                    });
                    return;
                } else {
                    filenames.push(filename);
                    promises.push(getFileJSON(rootFolder, file, filename, extension, filenameToRemoteIdMap[filename]));
                }
            }
        }

        // Reject if there are no pushable files
        if (filenames.length === 0) {
            reject({
                message: `Can't construct a Google Apps Script project without .gs, .js or .html files.`,
                print: true,
            });
            return;
        }

        // When all the files are read and have their json returned
        Promise.all(promises).then((values) => {
            // Construct a local.json file based on values and write that file
            const localJSON = {
                "files": values,
            };

            // Delete all id's if we are publishing to gas-include
            if (publish) {
                for (const file of localJSON.files) {
                    Reflect.deleteProperty(file, 'id');
                }
            }

            // Create file
            const file = {
                name: path.join(rootFolder, constants.META_DIR, destination),
                source: JSON.stringify(localJSON),
            };
            createFile(file);
            resolve();
            return;
        }).catch(() => {
            reject({
                message: `Can't construct a Google Apps Script project without .gs, .js or .html files.`,
                print: true,
            });
            return;
        });
    });
}

module.exports = packLocal;
