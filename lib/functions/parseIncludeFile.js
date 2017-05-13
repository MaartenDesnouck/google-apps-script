var constants = require('../constants.js');
var fs = require('fs');

var regex = new RegExp('^(\'([^\']*)\'|\"([^\"]*)\")[ ]*-[ ]*(\'([^\']*)\'|\"([^\"]*)\")[ ]*$');

/**
 * Parse the content of the include file.
 *
 * @param {callback} callback - The callback that handles the response.
 */
function parseIncludeFile(callback) {
    var includeFile = './' + constants.INCLUDE_FILE;
    fs.readFile(includeFile, 'utf8', function(err, content) {
        if (err) {
            if (err.code == 'ENOENT') {
                err = 'There appears to be no \'' + constants.INCLUDE_FILE + '\' file in this folder.'
            }
            callback(err);
            return;
        } else {

            // Parse content of include file
            var files = [];
            var lineNr = 0;
            lines = content.split("\n");

            for (line of lines) {
                if (line !== '') {
                    lineNr++;
                    var match = regex.exec(line);

                    if (match) {
                        var name = '';
                        var url = '';

                        if (match[2]) {
                            name = match[2];
                        } else if (match[3]) {
                            name = match[3];
                        } else {
                            callback('There seems to be a mistake in your ' + constants.INCLUDE_FILE + ' file at line ' + lineNr + '.');
                        }

                        if (match[5]) {
                            url = match[5];
                        } else if (match[6]) {
                            url = match[6];
                        } else {
                            callback('There seems to be a mistake in your ' + constants.INCLUDE_FILE + ' file at line ' + lineNr + '.');
                        }

                        files.push([name, url]);
                    } else {
                        callback('There seems to be a mistake in your ' + constants.INCLUDE_FILE + ' file at line ' + lineNr + '.');
                        return;
                    }
                }
            }
            callback(null, files);
            return;
        }
    });
}

module.exports = parseIncludeFile;
