const fs = require('fs-extra');
const path = require('path');
const createFile = require('./createFile.js');
const getAllFiles = require('./getAllFiles.js');
const getAllFolders = require('./getAllFolders.js');
const eaft = require('./extensionAndFiletype.js');
const constants = require('../constants.js');
const ignore = require('./ignore.js');

/**
 * Unpack a remote google script file into seperate .js and .html files
 *
 * @param {String} rootFolder - relative path to the rootFolder of the project
 * @param {String} fileName - if specified, only this file will get unpacked
 * @returns {Promise} - A promise resolving no value
 */
function unpackRemote(rootFolder, fileName) {
    let foundSingleFile = false;
    const local = path.join(rootFolder, constants.META_DIR, constants.META_LOCAL);
    const remote = path.join(rootFolder, constants.META_DIR, constants.META_REMOTE);

    // Read local files
    const localFiles = getAllFiles(rootFolder, '.', []);

    // Get valid extensions for code files
    const extensions = eaft.getCodeExtensions();

    // Get contents of .gasignore file
    const ignoreRegexes = ignore.getIgnoreRegexes(rootFolder);

    // Read remote.json
    const data = fs.readFileSync(remote, 'utf8');
    const result = JSON.parse(data);

    // Create all javascript/html files from remote.json
    const remoteFiles = [];
    const remoteNames = [];
    for (const file of result.files) {
        const extension = eaft.getExtensionFromFiletype(file.type, extensions);
        const remoteFileName = file.name + extension;
        file.name = path.join(rootFolder, remoteFileName);
        remoteNames.push(remoteFileName);

        const included = file.name.substring(0, constants.INCLUDE_DIR.length + 1) === `${constants.INCLUDE_DIR}/`;

        // What files do we need to create?
        if (!fileName) {
            remoteFiles.push(file);
        } else if (fileName === remoteFileName) {
            remoteFiles.push(file);
            foundSingleFile = true;
        }
    }

    // If we have not found our file
    if (fileName && !foundSingleFile) {
        console.log(`Can't seem to find the file '${fileName}' in this project`);
        return;
    }

    // Write local.json
    createFile({
        name: local,
        source: data,
    });

    // Sync create all necessary files
    for (const remoteFile of remoteFiles) {
        createFile(remoteFile);
    }

    // If there was no file specified to pull we will do a cleanup
    if (!fileName) {
        // Remove all .gs, .js, .html and appsscript.json files that were not in remote.json unless they are in .gasignore
        const toDelete = [];
        for (const localFileName of localFiles) {
            const localExtension = path.parse(localFileName).ext;
            const fileNameWithoutExtension = path.join(path.parse(localFileName).dir, path.parse(localFileName).name);
            if (eaft.isPushable(localExtension, fileNameWithoutExtension, extensions, ignoreRegexes) &&
                !remoteNames.includes(localFileName) && localFileName !== constants.INCLUDE_FILE) {
                toDelete.push(path.join(rootFolder, localFileName));
            }
        }

        // Delete files
        for (const fileToDelete of toDelete) {
            fs.removeSync(fileToDelete);
        }

        // Remove all empty folders
        const allFolders = getAllFolders(rootFolder).sort().reverse();
        for (const emptyFolder of allFolders) {
            const files = fs.readdirSync(emptyFolder);
            if (files.length === 0) {
                fs.removeSync(emptyFolder);
            } else if (files.length === 1 && files[0] === '.DS_Store') {
                fs.removeSync(emptyFolder);
            }
        }
    }

    ignore.addGitIgnore(rootFolder);
    ignore.addGasIgnore(rootFolder);
}

module.exports = unpackRemote;
