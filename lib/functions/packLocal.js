var fs = require('fs');
var constants = require('../constants.js');

/**
 * Unpack a raw google script file into seperate .js files
 *
 * @param {string} uri Location of file to unpack.
 * @param {getEventsCallback} callback
 */
module.exports = function(changes, callback) {
    var local = constants.META_DIR + constants.META_LOCAL;
    var remote = constants.META_DIR + constants.META_REMOTE;
    fs.readFile(local, 'utf8', function(err, data) {
        if (err) {
            callback(err);
        }
        //console.log(data);
        var result = JSON.parse(data);
    });
    var all = ''

    for (file of result['files']) {
        console.log(file);
        // fs.readFile(remote, 'utf8', function(err, data) {
        //     if (err) {
        //         return console.log(err);
        //     }
        //     //console.log(data);
        //     var result = JSON.parse(data);
        // });
    }
    fs.writeFile(constants.META_DIR + 'test.js', all, function() {});
}
