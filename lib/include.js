var parseIncludeFile = require('./functions/parseIncludeFile.js');
var downloadIncludedFiles = require('./functions/downloadIncludedFiles.js');

/**
 * Download included Google Apps Script files to INLCUDED folder
 */
module.exports = function() {
    console.log('Downloading include files...');
    parseIncludeFile(function(err, include) {
        if (err) {
            console.log('gas returned an error: ' + err);
        } else {
            downloadIncludedFiles(include, null, function(err, count) {
                if (err) {
                    console.log('gas returned an error: ' + err);
                } else {
                    console.log('Succesfully donwloaded ' + count + ' included files');
                }
            });
        }
    });
}
