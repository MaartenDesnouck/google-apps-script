var fs = require('fs');
var constants = require('../constants.js');

/**
 * Unpack a remote google script file into seperate .js files
 *
 * @param {getEventsCallback} callback
 */
module.exports = function(name, callback) {
    if (name) {
        var folder = './' + name + '/'
    } else {
        var folder = './'
    }
    
    var local = folder + constants.META_DIR + constants.META_LOCAL;
    var remote = folder + constants.META_DIR + constants.META_REMOTE;

    fs.readFile(remote, 'utf8', function(err, data) {
        if (err) {
            callback(err);
            return;
        }
        var result = JSON.parse(data);
        for (file of result['files']) {
            fs.writeFile(folder + file.name + '.js', file.source, function() {});
        }
        fs.writeFile(local, data, function() {});
        callback();
        return;
    });
}
