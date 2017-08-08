const fs = require('fs-extra');
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
 * @returns {Promise} - A promise resolving no value
 */
function unpackRemote(rootFolder) {
    return new Promise((resolve, reject) => {
        const local = path.join(rootFolder, constants.META_DIR, constants.META_LOCAL);
        const remote = path.join(rootFolder, constants.META_DIR, constants.META_REMOTE);

        try {
            // Read local files
            const localFiles = getAllFiles(rootFolder, '.', []);

            // Read remote.json
            const data = fs.readFileSync(remote, 'utf8');
            const result = JSON.parse(data);

            // Create all javascript/html files from remote.json that do not contain '/*gas-ignore*/'
            const remoteFiles = [];
            const remoteNames = [];
            for (const file of result.files) {
                const remoteFileName = path.join(file.name + (file.type === 'html' ? '.html' : '.js'));
                file.name = path.join(rootFolder, remoteFileName);
                remoteNames.push(remoteFileName);

                const included = file.name.substring(0, constants.INCLUDE_DIR.length + 1) === `${constants.INCLUDE_DIR}/`;

                if (!file.source.includes(constants.IGNORE) && !included) {
                    remoteFiles.push(file);
                }
            }

            // Synch create all necessary files
            for (const remoteFile of remoteFiles) {
                createFile(remoteFile);
            }

            // Write local.json
            createFile({
                name: local,
                source: data,
            });

            // Remove all .js and .html that were not in remote.json
            const toDelete = [];
            for (const localFileName of localFiles) {
                const extension = path.parse(localFileName).ext;
                if ((extension === '.html' || extension === '.js') && !remoteNames.includes(localFileName) && localFileName !== constants.INCLUDE_FILE) {
                    toDelete.push(path.join(rootFolder, localFileName));
                }
            }

            for (const fileToDelete of toDelete) {
                fs.unlinkSync(fileToDelete);
            }

            // Remove all empty folders
            const allFolders = getAllFolders(rootFolder).sort().reverse();

            for (const emptyFolder of allFolders) {
                const files = fs.readdirSync(emptyFolder);
                if (files.length === 0) {
                    fs.rmdirSync(emptyFolder);
                } else if (files.length === 1 && files[0] === '.DS_Store') {
                    fs.unlinkSync(path.join(emptyFolder, '.DS_Store'));
                    fs.rmdirSync(emptyFolder);
                }
            }

            // If no .gitignore files exists, add one
            const gitignore = path.join(rootFolder, '.gitignore');
            if (!fs.existsSync(gitignore)) {
                fs.writeFileSync(gitignore, gitignoreContent);
            }
        } catch (err) {
            reject(err);
            return;
        }
        resolve();
        return;
    });
}

module.exports = unpackRemote;
