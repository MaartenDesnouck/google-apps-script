var fs = require('fs');
var mkdirp = require('mkdirp');

/**
 * Synch create files
 *
 * @param {object} files - Files to create.
 * @param {index} index - Index of the current file to create.
 * @param {callback} callback
 */
function createFiles(files, index, callback) {
    if (files.length > 0) {
        file = files[index];
        folder = file.name.split('/').slice(0, -1).join('/');
        mkdirp(folder, function(err) {
            if (err) {
                callback(err);
            } else {
                fs.writeFile(file.name, file.source, function(err) {
                    if (err) {
                        callback(err);
                        return;
                    } else {
                        next(files, index, callback);
                    }
                });
            }
        });
    } else {
        callback();
        return;
    }
};

/**
 * Calling the next createFiles.
 *
 * @param {object} files - Files to create.
 * @param {integer} index - Current index.
 * @param {callback} callback
 */
function next(files, index, callback) {
    index += 1;

    if (index < files.length) {
        createFiles(files, index, callback);
    } else {
        callback();
    }
};

module.exports = createFiles;
