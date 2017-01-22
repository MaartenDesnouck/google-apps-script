var fs = require('fs');
var constants = require('../constants.js');

/**
 * Unpack a remote google script file into seperate .js files
 *
 * @param {getEventsCallback} callback
 */
module.exports = function(force, callback) {
    var local = constants.META_DIR + constants.META_LOCAL;
    var remote = constants.META_DIR + constants.META_REMOTE;
    //Calculate changes and ask for confimation, add -f flag to not do that

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
