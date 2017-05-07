var parseIncludeFile = require('./functions/parseIncludeFile.js');
var downloadIncludedFiles = require('./functions/downloadIncludedFiles.js');
var getId = require('./functions/getId.js');

/**
 * Download included Google Apps Script files to INLCUDED folder
 */
module.exports = function() {
    getId(function(err, fileId, dir) {
        if (err) {
            console.log('gas returned an error: ' + err);
        } else {
            parseIncludeFile(function(err, include) {
                if (err) {
                    console.log('gas returned an error: ' + err);
                } else {
                    downloadIncludedFiles(include, null, function(err, count) {
                        if (err) {
                            console.log('gas returned an error: ' + err);
                        } else {
                            console.log('Succesfully updated ' + count + ' included file(s)');
                        }
                    });
                }
            });
        }
    });
}
