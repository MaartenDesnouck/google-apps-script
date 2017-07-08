const fs = require('fs');
const path = require('path');
const createFile = require('./createFile.js');
const getAllFiles = require('./getAllFiles.js');
const getAllFolders = require('./getAllFolders.js');
const constants = require('../constants.js');

const gitignoreContent = '# .gitignore for Google Apps Script projects using https://www.npmjs.com/package/google-apps-script\n' +
    '.gas/local.json\n' +
    '.gas/remote.json\n' +
    'gas-include/*\n';

/**
 * Unpack a remote google script file into seperate .js and .html files
 *
 * @param {string} name - Name of the Google Apps Script project.
 * @param {callback} callback - The callback that handles the response.
 */
function unpackRemote(name, callback) {
    var folder = '.';
    if (name) {
        folder = path.join(folder, name);
    }

    var local = path.join(folder, constants.META_DIR, constants.META_LOCAL);
    var remote = path.join(folder, constants.META_DIR, constants.META_REMOTE);

    try {
        // Read local files
        var localFiles = getAllFiles(folder, []);

        // Read remote.json
        var data = fs.readFileSync(remote, 'utf8');
        var result = JSON.parse(data);

        // Create all javascript/html files from remote.json that do not contain '/*gas-ignore*/'
        var remoteFiles = [];
        var remoteNames = [];
        for (const file of result.files) {
            var remoteFileName = file.name + (file.type === 'html' ? '.html' : '.js');
            file.name = folder + '/' + remoteFileName;
            remoteNames.push(remoteFileName);
            if (!file.source.includes(constants.IGNORE)) {
                remoteFiles.push(file);
            }
        }

        // Synch create all necessary files
        for (var remoteFile of remoteFiles) {
            createFile(remoteFile);
        }

        // Write local.json
        fs.writeFileSync(local, data);

        // Remove all .js and .html that were not in remote.json
        var toDelete = [];
        for (const localFileName of localFiles) {
            var extension = localFileName.split('.').reverse()[0];
            if ((extension === 'html' || extension === 'js') && !remoteNames.includes(localFileName) && localFileName !== constants.INCLUDE_FILE) {
                toDelete.push(localFileName);
            }
        }

        for (const fileToDelete of toDelete) {
            fs.unlinkSync(fileToDelete);
        }

        // Remove all empty folders
        allFolders = getAllFolders(folder);
        allFolders.sort().reverse();

        for (const emptyFolder of allFolders) {
            files = fs.readdirSync(emptyFolder);
            if (files.length === 0) {
                fs.rmdirSync(emptyFolder);
            } else if (files.length === 1 && files[0] === '.DS_Store') {
                fs.unlinkSync(emptyFolder + '/.DS_Store');
                fs.rmdirSync(emptyFolder);
            }
        }

        // If no .gitignore files exists, add one
        gitignore = folder + '/.gitignore';
        if (!fs.existsSync(gitignore)) {
            fs.writeFileSync(gitignore, gitignoreContent);
        }
    } catch (err) {
        callback(err);
        return;
    }
    callback();
    return;
}

module.exports = unpackRemote;
