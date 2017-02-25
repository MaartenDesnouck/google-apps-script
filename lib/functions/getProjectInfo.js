var fs = require('fs');
var constants = require('../constants.js');

/**
 * Get the id of the current google apps script project
 *
 * @param {getEventsCallback} callback
 */
module.exports = function(callback) {
    var uri = constants.META_DIR + constants.META_ID;
    fs.readFile(uri, 'utf8', function(err, data) {
        if (err) {
            callback(err, null, null);
            return;
        }
        callback(err, data, null);
        return;
    });
}
