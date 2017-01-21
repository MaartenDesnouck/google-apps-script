var fs = require('fs');
var constants = require('../constants.js');

/**
 * Pack all seperate .js files back into a raw google script file
 *
 * @param {list} changes Changes to be made to the raw file structure.
 * @param {string} uri Location of file to unpack.
 */
module.exports = function(changes, callback) {
    var local = constants.META_DIR + constants.META_LOCAL;
    var remote = constants.META_DIR + constants.META_REMOTE;

    fs.readFile(local, 'utf8', function(err, data) {
        if (err) {
            callback(err);
            return;
        }
        var all = ''
        var local = JSON.parse(data);
        updateLocal(changes, local, 0, function() {
            fs.writeFile(constants.META_DIR + constants.META_LOCAL, JSON.stringify(local), function() {
              callback();
            });

        });
    });
}

function updateLocal(changes, local, index, callback) {
    var file = local['files'][index];
    fs.readFile(file.name + '.js', 'utf8', function(err, content) {
        if (err) {
            callback(err);
        }
        file.source = content;

        index += 1;
        if (index < local['files'].length) {
            updateLocal(changes, local, index, callback);
        } else {
            callback();
        }
    });
}
