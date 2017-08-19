const fs = require('fs-extra');
const path = require('path');
const createFile = require('./createFile.js');
const getAllFiles = require('./getAllFiles.js');
const constants = require('../constants.js');

/**
 * Pack all seperate .js files back into a raw google script file
 *
 * @param {string} rootFolder - relative path to the rootFolder of the project
 * @returns {Promise} - A promise resolving no value
 */
function packLocalSingleFile(rootFolder, fileName) {
    // Read every local file and create a correct local.json file
    return new Promise((resolve, reject) => {
        const fileNameWithoutExtension = path.join(path.parse(fileName).dir, path.parse(fileName).name);

        // Read the file we are going to include
        fs.readFile(path.join(rootFolder, fileName), 'utf8', (err, source) => {
            if (err) {
                // TODO handle this well
                reject(`Can't seem to find '${fileName}'`);
                return;
            }

            // Read remote
            const remote = path.join(rootFolder, constants.META_DIR, constants.META_REMOTE);
            const remoteData = JSON.parse(fs.readFileSync(remote, 'utf8'));

            // Check if file already in remote
            let alreadyInRemote = false;
            for (const file of remoteData.files) {
                //console.log(JSON.stringify(file));
                if (file.name === fileNameWithoutExtension) {
                    file.source = source;
                    alreadyInRemote = true;
                    break;
                }
            }

            // Add the file if not already in remote
            if (!alreadyInRemote) {
                const extension = path.parse(fileName).ext;
                const type = extension === '.js' ? 'server_js' : 'html';
                remoteData.files.push({
                    name: fileNameWithoutExtension,
                    type,
                    source,
                });
            }

            // Write to local.json
            const local = path.join(rootFolder, constants.META_DIR, constants.META_LOCAL);
            const file = {
                name: local,
                source: JSON.stringify(remoteData),
            };
            createFile(file);
            resolve();
        });
    });
}

module.exports = packLocalSingleFile;
