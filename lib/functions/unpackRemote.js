var fs = require('fs');
var constants = require('../constants.js');

/**
 * Unpack a raw google script file into seperate .js files
 *
 * @param {string} uri Location of file to unpack.
 * @param {getEventsCallback} callback
 */
module.exports = function(callback) {
    var local = constants.META_DIR + constants.META_LOCAL;
    var remote = constants.META_DIR + constants.META_REMOTE;

    fs.readFile(remote, 'utf8', function(err, data) {
        if (err) {
            callback(err);
            return;
        }
        var result = JSON.parse(data);
        for (file of result['files']) {
            fs.writeFile(file.name + '.js', file.source, function() {});
        }
        fs.writeFile(local, data, function() {});
        callback();
        return;
    });
}
