var fs = require('fs');
var constants = require('../constants.js');

/**
 * Pack all seperate .js files back into a raw google script file
 *
 * @param {list} changes Changes to be made to the raw file structure.
 * @param {string} uri Location of file to unpack.
 */

var local = constants.META_DIR + constants.META_LOCAL;
var remote = constants.META_DIR + constants.META_REMOTE;
var files;
var localJSON = {
    "files": []
};
var ids = {};

module.exports = function(callback) {

    fs.readFile(remote, 'utf8', function(err, data) {
        if (err) {
            callback(err);
            return;
        }

        var oldLocalJSON = JSON.parse(data)['files'];
        for (var piece of oldLocalJSON) {
            ids[piece.name] = piece.id;
        }

        fs.readdir('.', function(err, localFiles) {
            files = localFiles;
            updateLocal(0, function() {
                fs.writeFile(constants.META_DIR + constants.META_LOCAL, JSON.stringify(localJSON), function() {
                    callback();
                });
            });
        });
    });
}

function updateLocal(index, callback) {
    var name = files[index];

    if (name.substring(name.length - 3, name.length) === '.js') {
        fs.readFile(name, 'utf8', function(err, content) {
            if (err) {
                callback(err);
            }

            var file = new Object();
            file.name = name.substring(0, name.length - 3);
            file.id = ids[file.name];
            file.type = "server_js";
            file.source = content;
            localJSON['files'].push(file);

            index += 1;

            if (index < files.length) {
                updateLocal(index, callback);
            } else {
                callback();
            }
        });
    } else {
        index += 1;

        if (index < files.length) {
            updateLocal(index, callback);
        } else {
            callback();
        }
    }
}
