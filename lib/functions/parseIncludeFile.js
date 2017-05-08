var constants = require('../constants.js');
var fs = require('fs');

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
            callback(err, null);
            return;
        } else {
            // Parse content of include file
            try {
                parsed = JSON.parse(content);
            } catch (e) {
                callback('Failed to parse the content of the \'' + constants.INCLUDE_FILE + '\' file\nPlease check if it is a valid JSON file');
                return;
            }

            var files = [];
            for (var filename in parsed) {
                var url = parsed[filename];
                if (typeof url !== 'string') {
                    callback('The \'' + constants.INCLUDE_FILE + '\' file does not appear to contain a flat JSON structure');
                    return;
                }
                files.push([filename, url]);
            }
            callback(null, files);
            return;
        }
    });
}

module.exports = parseIncludeFile;
