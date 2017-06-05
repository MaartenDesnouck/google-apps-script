var fs = require('fs');
var getAllFiles = require('./getAllFiles.js');
var constants = require('../constants.js');

var local = constants.META_DIR + '/' + constants.META_LOCAL;
var remote = constants.META_DIR + '/' + constants.META_REMOTE;
var files = [];
var localJSON = {
    "files": []
};
var ids = {};

/**
 * Pack all seperate .js files back into a raw google script file
 *
 * @param {callback} callback - The callback that handles the response.
 */
function packLocal(callback) {

    // Read remote.json in order to get remote id's
    fs.readFile(remote, 'utf8', function(err, data) {
        if (err) {
            callback(err);
            return;
        }

        // Read every local file and create a correct local.json file
        files = getAllFiles('.');
        updateLocal(0, function() {
            if (localJSON['files'].length === 0) {
                callback('Can\'t construct a Google Apps Script project without .js or .html files.');
                return;
            } else {
                fs.writeFile(constants.META_DIR + '/' + constants.META_LOCAL, JSON.stringify(localJSON), function() {
                    callback();
                    return;
                });
            }
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

    var extension = file.split('.').reverse()[0];
    var nameWithoutExtension = file.replace(/(.+)\.[^\.]+/, '$1');

    // Check if ending in .js
    if (extension === 'js' || extension === 'html') {
        fs.stat(file, function(err, stats) {
            if (stats.isFile()) {

                // Read local javascript file and add it to the object
                fs.readFile(file, 'utf8', function(err, content) {
                    if (err) {
                        callback(err);
                    }

                    path = nameWithoutExtension.split('/');
                    // Include files get gas-ignore added so we don't pull them
                    if ((path.length > 1) && (path[0] === constants.INCLUDE_DIR)) {
                        content = constants.IGNORE + '\n\n' + content;
                    }

                    var fileJSON = new Object();
                    fileJSON.name = nameWithoutExtension;
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

module.exports = packLocal;
