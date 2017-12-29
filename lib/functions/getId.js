const fs = require('fs-extra');
const path = require('path');
const constants = require('../constants.js');

/**
 * Get the id of the current google apps script project
 *
 * @param {String} rootFolder - relative path to the rootFolder of the project
 * @returns {Promise} - A promise resolving an id
 */
function getId(rootFolder) {
    return new Promise((resolve, reject) => {
        const dir = path.join(rootFolder, constants.META_DIR, constants.META_ID);
        fs.readFile(dir, 'utf8', (err, id) => {
            if (err) {
                reject(err);
                return;
            } else {
                resolve(id);
                return;
            }
        });
    });
}

module.exports = getId;
