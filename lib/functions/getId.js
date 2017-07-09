const fs = require('fs');
const path = require('path');
const constants = require('../constants.js');

/**
 * Get the id of the current google apps script project
 *
 * @param {callback} callback - The callback that handles the response.
 * @return {void}
 */
function getId(callback) {
    const uri = path.join(constants.META_DIR, constants.META_ID);
    fs.readFile(uri, 'utf8', (err, data) => {
        if (err) {
            callback(err, null, null);
            return;
        } else {
            callback(null, data, null);
            return;
        }
    });
}

module.exports = getId;
