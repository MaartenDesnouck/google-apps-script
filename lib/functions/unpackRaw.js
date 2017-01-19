var fs = require('fs');

/**
 * Unpack a raw google script file into seperate .js files
 *
 * @param {string} uri Location of file to unpack.
 * @param {getEventsCallback} callback
 */
module.exports = function(uri, callback) {
    fs.readFile(uri, 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        }
        //console.log(data);
        var result = JSON.parse(data);
        for (file of result['files']) {
            fs.writeFile(file.name + '.js', file.source, function() {});
        }
        callback('Done');
    });
}
