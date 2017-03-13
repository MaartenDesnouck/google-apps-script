var fs = require('fs');
var constants = require('../constants.js');

/**
 * Unpack a remote google script file into seperate .js files
 *
 * @param {string} name - Name of the Google Apps Script project.
 * @param {callback} callback
 */
module.exports = function(name, callback) {
    if (name) {
        var folder = './' + name + '/'
    } else {
        var folder = './'
    }

    var local = folder + constants.META_DIR + constants.META_LOCAL;
    var remote = folder + constants.META_DIR + constants.META_REMOTE;

    // Read local files
    fs.readdir(folder, function(err, localFiles) {
        // Remove all .js and .html files from the folder
        unlinkAll(localFiles, 0, function(err) {
            if (err) {
                callback(err);
                return;
            }

            // Read remote.json
            fs.readFile(remote, 'utf8', function(err, data) {
                if (err) {
                    callback(err);
                    return;
                }
                var result = JSON.parse(data);

                // Create all javascript/html files from remote.json
                for (file of result['files']) {
                    fs.writeFile(folder + file.name + (file.type === 'html' ? '.html' : '.js'), file.source, function() {});
                }
                fs.writeFile(local, data, function() {});
                callback();
                return;
            });
        });
    });
};

/**
 * Unlink all javascript files
 *
 * @param {object} files - Files ot unlink.
 * @param {index} index - Index of the current file to unlink.
 * @param {callback} callback
 */
function unlinkAll(files, index, callback) {
    var file = files[index];
    var extension = file.split('.').reverse()[0];

    // Check if extension matches
    if (extension === 'html' || extension === 'js') {

        // Check if it is a file
        fs.stat(file, function(err, stats) {
            if (stats.isFile()) {

                // Delete file
                fs.unlink(file, function() {
                    next(files, index, callback);
                });
            } else {
                next(files, index, callback);
            }
        });
    } else {
        next(files, index, callback);
    }
};

/**
 * Calling the next unlinkAll.
 *
 * @param {object} files - Files to unlink.
 * @param {integer} index - Current index.
 * @param {callback} callback
 */
function next(files, index, callback) {
    index += 1;

    if (index < files.length) {
        unlinkAll(files, index, callback);
    } else {
        callback();
    }
};
