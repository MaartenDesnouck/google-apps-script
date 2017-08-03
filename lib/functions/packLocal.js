const fs = require('fs-extra');
const path = require('path');
const createFile = require('./createFile.js');
const getAllFiles = require('./getAllFiles.js');
const constants = require('../constants.js');

const local = path.join(constants.META_DIR, constants.META_LOCAL);
const remote = path.join(constants.META_DIR, constants.META_REMOTE);

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
                fs.readFile(file, 'utf8', (err, content) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    const myPath = nameWithoutExtension.split('/'); //TODO
                    // Included files get '/*gas-ignore*/' so we don't pull them
                    if ((myPath.length > 1) && (myPath[0] === constants.INCLUDE_DIR)) {
                        content = `${constants.IGNORE}\n\n${content}`;
                    }

                    const type = extension === 'js' ? 'server_js' : 'html';
                    const fileJSON = {
                        name: nameWithoutExtension,
                        type,
                        source: content,
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
function packLocal() {
    // Read every local file and create a correct local.json file
    return new Promise((resolve, reject) => {
        const files = getAllFiles('.');
        const promises = [];
        for (const file of files) {
            const extension = file.split('.').reverse()[0];
            const nameWithoutExtension = file.replace(/(.+)\.[^\.]+/, '$1');

            // If extension is correct and file does not start wiht a dot
            if((extension === 'js' || extension === 'html') && (file[0] !=='.')){
                promises.push(getFileJSON(file, nameWithoutExtension, extension));
            }
        }

        // Reject if there are no correct files
        if (promises.length === 0) {
            reject('Can\'t construct a Google Apps Script project without .js or .html files.');
            return;
        }

        // When all the files are read and have their json returned
        Promise.all(promises).then((values) => {
            // Construct a local.json file based on values and write that file
            const localJSON = {
                "files": values,
            };
            const file = {
                name: path.join(constants.META_DIR, constants.META_LOCAL),
                source: JSON.stringify(localJSON),
            };
            createFile(file);
            resolve();
            return;
        }).catch(() => {
            reject('Could not construct a Google Apps Script project. Please try again.');
            return;
        });
    });
}

module.exports = packLocal;
