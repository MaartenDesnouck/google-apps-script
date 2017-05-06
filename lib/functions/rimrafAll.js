var fs = require('fs');
var rimraf = require('rimraf');

/**
 * Delete all files
 *
 * @param {object} files - Files to unlink.
 * @param {index} index - Index of the current file to unlink.
 * @param {callback} callback
 */
function rimrafAll(dir, files, index, callback) {
    if (files.length > 0) {
        var file = dir + '/' + files[index];
        // Check if it is a file
        fs.stat(file, function(err, stats) {
            if (err) {
                callback(err);
                return;
            } else {
                if (stats.isFile()) {

                    // Delete file
                    rimraf(file, function() {
                        next(files, index, callback);
                    });
                } else {
                    next(files, index, callback);
                }
            }
        });
    } else {
        callback();
        return;
    }
};

/**
 * Calling the next rimrafAll.
 *
 * @param {object} files - Files to unlink.
 * @param {integer} index - Current index.
 * @param {callback} callback
 */
function next(files, index, callback) {
    index += 1;

    if (index < files.length) {
        rimrafAll(files, index, callback);
    } else {
        callback();
    }
};

module.exports = rimrafAll;
