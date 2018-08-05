const fs = require('fs-extra');
const path = require('path');
const createFile = require('./createFile.js');
const eaft = require('./extensionAndFiletype.js');
const ignore = require('./ignore.js');
const checkbox = require('./checkbox.js');
const constants = require('../constants.js');

/**
 * Write the source to the write file
 *
 * @param {String} source - relative path to the rootFolder of the project
 * @param {String} rootFolder - relative path to the rootFolder of the project
 * @returns {void}
 */
function writeLocalJson(source, rootFolder) {
    // Write to local.json
    const local = path.join(rootFolder, constants.META_DIR, constants.META_LOCAL);
    const file = {
        name: local,
        source: JSON.stringify(source),
    };
    createFile(file);
}

/**
 * Pack all seperate .js files back into a raw google script file
 *
 * @param {String} rootFolder - relative path to the rootFolder of the project
 * @param {String} fileName - which file we should add to local.json
 * @returns {Promise} - A promise resolving no value
 */
function addLocalSingleFile(rootFolder, fileName) {
    // Read every local file and create a correct local.json file
    const fileNameWithoutExtension = path.join(path.parse(fileName).dir, path.parse(fileName).name);
    const extension = path.parse(fileName).ext;

    // Get valid extensions for code files
    const extensions = eaft.getCodeExtensions();

    // Get contents of .gasignore file
    const ignoreRegexes = ignore.getIgnoreRegexes(rootFolder);

    // Test if the file is pushable
    if (!eaft.isPushable(extension, fileNameWithoutExtension, extensions, ignoreRegexes)) {
        checkbox.display('red');
        throw {
            message: `Can't push this file to remote because of an invalid extension or name`,
            print: true,
        };
    }

    // Read remote
    const remote = path.join(rootFolder, constants.META_DIR, constants.META_REMOTE);
    const remoteData = fs.readJsonSync(remote, 'utf8');

    // Read the file we are going to include
    let source = '';
    try {
        source = fs.readFileSync(path.join(rootFolder, fileName), 'utf8');
    } catch (err) {
        throw {
            message: `Can't seem to find '${fileName}' in the local filesystem`,
            print: true,
        };
    }

    // Check if file already in remote
    let alreadyInRemote = false;
    for (const file of remoteData.files) {
        if (file.name === fileNameWithoutExtension) {
            file.source = source;
            alreadyInRemote = true;
            break;
        }
    }

    // Add the file if not already in remote
    if (!alreadyInRemote) {
        const extension = path.parse(fileName).ext;
        const type = eaft.getFiletypeFromExtension(extension);
        remoteData.files.push({
            name: fileNameWithoutExtension,
            type,
            source,
        });
    }

    // Write local.json
    writeLocalJson(remoteData, rootFolder);
}

/**
 * Pack all seperate .js files back into a raw google script file
 *
 * @param {String} rootFolder - relative path to the rootFolder of the project
 * @param {String} fileName - which file we should add to local.json
 * @returns {void}
 */
function removeRemoteSingleFile(rootFolder, fileName) {
    // Read every local file and create a correct local.json file
    const fileNameWithoutExtension = path.join(path.parse(fileName).dir, path.parse(fileName).name);
    const extension = path.parse(fileName).ext;

    // Read remote
    const remote = path.join(rootFolder, constants.META_DIR, constants.META_REMOTE);
    const remoteData = JSON.parse(fs.readFileSync(remote, 'utf8'));

    // Check if file is in remote
    let inRemote = false;
    for (let index = 0; index < remoteData.files.length; index++) {
        if (remoteData.files[index].name === fileNameWithoutExtension) {
            inRemote = true;
            // lets remove the file
            remoteData.files.splice(index, 1);
            break;
        }
    }

    // If not in remote
    if (!inRemote) {
        throw {
            message: `Can't seem to find '${fileName}' in the remote Google Apps Script file`,
            print: true,
        };
    }

    // Write to local.json
    writeLocalJson(remoteData, rootFolder);
}

module.exports = {
    addLocalSingleFile,
    removeRemoteSingleFile,
};
