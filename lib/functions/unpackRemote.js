var fs = require('fs');
var rimrafAll = require('./rimrafAll.js')
var constants = require('../constants.js');

/**
 * Unpack a remote google script file into seperate .js and .html files
 *
 * @param {string} name - Name of the Google Apps Script project.
 * @param {callback} callback - The callback that handles the response.
 */
function unpackRemote(name, callback) {
    var folder = '.'
    if (name) {
        var folder = folder + '/' + name
    }

    var local = folder + '/' + constants.META_DIR + '/' + constants.META_LOCAL;
    var remote = folder + '/' + constants.META_DIR + '/' + constants.META_REMOTE;

    // Read local files
    fs.readdir(folder, function(err, localFiles) {
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
            var remoteNames = [];
            for (file of result['files']) {
                var fileName = file.name + (file.type === 'html' ? '.html' : '.js');
                remoteNames.push(fileName);

                // Write local file if remote does not contain '/*gas-ignore*/'
                if (!file.source.includes(constants.IGNORE)) {
                    fs.writeFile(folder + '/' + fileName, file.source, function() {});
                }
            }
            fs.writeFile(local, data, function() {});

            // Remove all .js and .html that were not in remote.json
            var toDelete = [];
            for (file in localFiles) {
                var name = localFiles[file];
                var extension = name.split('.').reverse()[0];
                if ((extension === 'html' || extension === 'js') && !remoteNames.includes(name) && name != constants.INCLUDE_FILE) {
                    toDelete.push(['.', name]);
                }
            }
            rimrafAll(toDelete, 0, function(err) {
                if (err) {
                    callback(err);
                    return;
                } else {
                    callback();
                }
            });
        });
    });
};

module.exports = unpackRemote;
