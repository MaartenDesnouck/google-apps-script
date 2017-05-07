var fs = require('fs');
var constants = require('../constants.js');

/**
 * Get the id of the current google apps script project
 *
 * @param {callback} callback - The callback that handles the response.
 */
function getId(callback) {
    var uri = constants.META_DIR + '/' + constants.META_ID;
    fs.readFile(uri, 'utf8', function(err, data) {
        if (err) {
            if (err.code == 'ENOENT') {
                err = 'There appears to be no project linked to this folder. \n' +
                    'Navigate to a project folder or execute \'gas new <name>\',' +
                    ' \'gas clone <fileId>\' or \'gas link <fileId>\' to get started.'
            }
            callback(err, null, null);
            return;
        } else {
            callback(null, data, null);
            return;
        }
    });
}

module.exports = getId;
