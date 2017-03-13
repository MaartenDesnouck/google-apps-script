var fs = require('fs');
var constants = require('../constants.js');

var local = constants.META_DIR + constants.META_LOCAL;
var remote = constants.META_DIR + constants.META_REMOTE;
var files;
var localJSON = {
    "files": []
};
var ids = {};

/**
 * Pack all seperate .js files back into a raw google script file
 *
 * @param {callback} callback
 */
module.exports = function(callback) {

    // Read remote.json in order to get remote id's
    fs.readFile(remote, 'utf8', function(err, data) {
        if (err) {
            callback(err);
            return;
        }

        // Parse remote id's
        var remoteJSON = JSON.parse(data)['files'];
        for (var piece of remoteJSON) {
            ids[piece.name] = piece.id;
        }

        // Read every local file and create a correct local.json file
        fs.readdir('.', function(err, localFiles) {
            files = localFiles;
            updateLocal(0, function() {
                fs.writeFile(constants.META_DIR + constants.META_LOCAL, JSON.stringify(localJSON), function() {
                    callback();
                });
            });
        });
    });
};

/**
 * Synchronously updating localJSON for all files.
 *
 * @param {integer} Index - Index of file to process.
 * @param {callback} callback
 */
function updateLocal(index, callback) {
    var file = files[index];
    var filename = file.replace(/(.+)\.[^\.]+/,'$1');
    var extension = file.split('.').reverse()[0];

    // Check if ending in .js
    if (extension === 'js' || extension === 'html') {
        fs.stat(file, function(err, stats) {
            if (stats.isFile()) {

                // Read local javascript file and add it to the object
                fs.readFile(file, 'utf8', function(err, content) {
                    if (err) {
                        callback(err);
                    }

                    var fileJSON = new Object();
                    fileJSON.name = filename;
                    fileJSON.id = ids[fileJSON.name];
                    fileJSON.type = extension === 'js' ? 'server_js' : 'html';
                    fileJSON.source = content;
                    localJSON['files'].push(fileJSON);
                    next(index, callback);
                });
            } else {
                next(index, callback);
            }
        });
    } else {
        next(index, callback);
    }
};

/**
 * Calling the next updateLocal.
 *
 * @param {integer} index - Current index.
 * @param {callback} callback
 */
function next(index, callback) {
    index += 1;

    if (index < files.length) {
        updateLocal(index, callback);
    } else {
        callback();
    }
};
