const fs = require('fs-extra');
const path = require('path');
const createFile = require('./createFile.js');
const getAllFiles = require('./getAllFiles.js');
const eaft = require('./extensionAndFiletype.js');
const ignore = require('./ignore.js');
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
 * @param {String} destination - relative path to the file we need to write to
 * @returns {Promise} - A promise resolving no value
 */
function pack(rootFolder, destination) {
    // Read every local file and create a correct json file in .gas/${destination}
    return new Promise((resolve, reject) => {
        const files = getAllFiles(rootFolder, '.');
        const promises = [];
        const filenames = [];

        // Get valid extensions for code files
        const extensions = eaft.getCodeExtensions();

        // Get contents of .gasignore file
        const ignoreRegexes = ignore.getIgnoreRegexes(rootFolder);

        // Check for all files in the root folder and all its subfolders if they are pushable
        for (const file of files) {
            const extension = path.parse(file).ext;
            const filename = path.join(path.parse(file).dir, path.parse(file).name).replace(`\\`, `/`);

            // If extension is correct and fileName does not start with a dot
            if (eaft.isPushable(extension, filename, extensions, ignoreRegexes)) {
                if (filenames.includes(filename)) {
                    reject({
                        message: `Can't construct a Google Apps Script project with files with the same name: '${filename}.*'`,
                        print: true,
                    });
                    return;
                } else {
                    filenames.push(filename);
                    promises.push(getFileJSON(rootFolder, file, filename, extension));
                }
            }
        }

        // Reject if there are no pushable files
        if (filenames.length === 0) {
            reject({
                message: `Can't construct a Google Apps Script project without ${extensions[0]}, .html or appsscript.json files`,
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
                message: `Can't construct a Google Apps Script project without ${extensions[0]}, .html or appsscript.json files`,
                print: true,
            });
            return;
        });
    });
}

/**
 * Pack all seperate .js files into a raw google script file for pushing
 *
 * @param {String} rootFolder - relative path to the rootFolder of the project
 * @returns {Promise} - A promise resolving no value
 */
function local(rootFolder) {
    // Construct name to remote id map
    const remote = path.join(rootFolder, constants.META_DIR, constants.META_REMOTE);
    const remoteSource = fs.readJsonSync(remote, 'utf8');
    const destination = constants.META_LOCAL;
    return pack(rootFolder, destination);
}

/**
 * Pack all seperate .js files into a raw google script file for publishing
 *
 * @param {String} rootFolder - relative path to the rootFolder of the project
 * @returns {Promise} - A promise resolving no value
 */
function publish(rootFolder) {
    // Read every local file and create a correct json file in .gas/${destination}
    ignore.addGitIgnore(rootFolder);
    ignore.addGasIgnore(rootFolder);
    const destination = constants.META_PUBLISH;
    return pack(rootFolder, destination);
}

module.exports = {
    local,
    publish,
};
