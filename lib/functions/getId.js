const fs = require('fs');
const path = require('path');
const constants = require('../constants.js');

/**
 * Get the id of the current google apps script project
 *
 * @returns {Promise}
 */
function getId(identifier) {
    return new Promise((resolve, reject) => {
        if (identifier) {
            resolve(identifier);
        }
        const dir = path.join(constants.META_DIR, constants.META_ID);
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
