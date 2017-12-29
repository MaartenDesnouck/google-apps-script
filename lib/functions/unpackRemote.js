const fs = require('fs-extra');
const path = require('path');
const createFile = require('./createFile.js');
const getAllFiles = require('./getAllFiles.js');
const getAllFolders = require('./getAllFolders.js');
const eaft = require('./extensionAndFiletype.js');
const constants = require('../constants.js');

const gitignoreContent = `# .gitignore for Google Apps Script projects using https://www.npmjs.com/package/google-apps-script\n` +
    `${constants.META_DIR}/*\n${constants.INCLUDE_DIR}/*\n`;

/**
 * Unpack a remote google script file into seperate .js and .html files
 *
 * @param {string} rootFolder - relative path to the rootFolder of the project
 * @param {string} fileName - if specified, only this file will get unpacked
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

    // Read remote.json
    const data = fs.readFileSync(remote, 'utf8');
    const result = JSON.parse(data);

    // Create all javascript/html files from remote.json that do not contain '/*gas-ignore*/'
    const remoteFiles = [];
    const remoteNames = [];
    for (const file of result.files) {
        const extension = eaft.getExtensionFromFiletype(file.type, extensions);
        const remoteFileName = file.name + extension;
        file.name = path.join(rootFolder, remoteFileName);
        remoteNames.push(remoteFileName);

        const included = file.name.substring(0, constants.INCLUDE_DIR.length + 1) === `${constants.INCLUDE_DIR}/`;

        // What files do we need to create?
        if (!file.source.includes(constants.IGNORE) && !included) {
            if (!fileName) {
                remoteFiles.push(file);
            } else if (fileName === remoteFileName) {
                remoteFiles.push(file);
                foundSingleFile = true;
            }

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

    // Synch create all necessary files
    for (const remoteFile of remoteFiles) {
        createFile(remoteFile);
    }

    // If there was no file specified to pull we will do a cleanup
    if (!fileName) {
        // Remove all .gs, .js, .html and appsscript.json files that were not in remote.json
        const toDelete = [];
        for (const localFileName of localFiles) {
            const localExtension = path.parse(localFileName).ext;
            if (eaft.isPushable(localExtension, path.parse(localFileName).name, extensions) &&
                !remoteNames.includes(localFileName) && localFileName !== constants.INCLUDE_FILE) {
                toDelete.push(path.join(rootFolder, localFileName));
            }
        }

        for (const fileToDelete of toDelete) {
            if (!fileName) {
                fs.removeSync(fileToDelete);
            }
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

    // If no .gitignore files exists, add one
    const gitignore = path.join(rootFolder, '.gitignore');
    if (!fs.existsSync(gitignore)) {
        fs.writeFileSync(gitignore, gitignoreContent);
    }
}

module.exports = unpackRemote;
