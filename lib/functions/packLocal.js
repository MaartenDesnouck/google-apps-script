var fs = require('fs');
var path = require('path');
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

        // Parse remote id's
        var remoteJSON = JSON.parse(data)['files'];
        if (remoteJSON !== undefined) {
            for (var piece of remoteJSON) {
                ids[piece.name] = piece.id;
            }
        } else {
            callback('Can\'t construct a Google Apps Script project without a remote.json file. Try \'gas pull\' first.');
            return;
        }

        // Read every local file and create a correct local.json file
        files = walkSync('.', []);
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
    //var isInclude = files[index][2];
    var file = files[index];
    console.log(file);

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

                    // if (isInclude) {
                    //     content = constants.IGNORE + '\n\n' + content;
                    // }

                    var fileJSON = new Object();
                    fileJSON.name = nameWithoutExtension;
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

/**
 * List all files in a directory in Node.js recursively in a synchronous fashion
 *
 * @param {dir} index - Current index.
 * @param {filelist} filelist - List of files already found.
 */
function walkSync(dir, filelist) {
    files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkSync(path.join(dir, file), filelist);
        } else {
            filelist.push(path.join(dir, file));
        }
    });
    return filelist;
};

module.exports = packLocal;
