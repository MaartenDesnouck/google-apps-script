const fs = require('fs');
const path = require('path');
const createFile = require('./createFile.js');
const getAllFiles = require('./getAllFiles.js');
const constants = require('../constants.js');

const local = path.join(constants.META_DIR, constants.META_LOCAL);
const remote = path.join(constants.META_DIR, constants.META_REMOTE);

var files = [];
var localJSON = {
    "files": [],
};
var ids = {};

/**
 * Synchronously updating localJSON for all files.
 *
 * @param {integer} Index - Index of file to process.
 * @param {callback} callback
 * @returns {void}
 */
function updateLocal(index, callback) {
    const file = files[index];
    const extension = file.split('.').reverse()[0];
    const nameWithoutExtension = file.replace(/(.+)\.[^\.]+/, '$1');

    // Check if ending in .js
    if (extension === 'js' || extension === 'html') {
        fs.stat(file, (err, stats) => {
            if (stats.isFile()) {

                // Read local javascript file and add it to the object
                fs.readFile(file, 'utf8', (err, content) => {
                    if (err) {
                        callback(err);
                        return;
                    }

                    const myPath = nameWithoutExtension.split('/');
                    // Included files have '/*gas-ignore*/' so we don't pull them
                    if ((myPath.length > 1) && (myPath[0] === constants.INCLUDE_DIR)) {
                        content = constants.IGNORE + '\n\n' + content;
                    }

                    const type = extension === 'js' ? 'server_js' : 'html';
                    const fileJSON = {
                        name: nameWithoutExtension,
                        type,
                        source: content,
                    };
                    localJSON.files.push(fileJSON);
                    next(index, callback);
                });
            } else {
                next(index, callback);
            }
        });
    } else {
        next(index, callback);
    }
}

/**
 * Pack all seperate .js files back into a raw google script file
 *
 * @returns {Promise} - A promise resolving no value
 */
function packLocal() {
    // Read every local file and create a correct local.json file
    return new Promise((resolve, reject) => {
        files = getAllFiles('.');
        updateLocal(0, () => {
            if (localJSON.files.length === 0) {
                reject('Can\'t construct a Google Apps Script project without .js or .html files.');
                return;
            } else {
                const file = {
                    name: path.join(constants.META_DIR, constants.META_LOCAL),
                    source: JSON.stringify(localJSON),
                };
                createFile(file);
                resolve();
                return;
            }
        });
    });
}

/**
 * Calling the next updateLocal.
 *
 * @param {integer} index - Current index.
 * @param {callback} callback
 * @returns {void}
 */
function next(index, callback) {
    index += 1;

    if (index < files.length) {
        updateLocal(index, callback);
    } else {
        callback();
        return;
    }
}

module.exports = packLocal;
