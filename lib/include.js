var parseIncludeFile = require('./functions/parseIncludeFile.js');
var downloadIncludedFiles = require('./functions/downloadIncludedFiles.js');
var handleError = require('./functions/handleError.js');
var getId = require('./functions/getId.js');

/**
 * Download included Google Apps Script files to INLCUDED folder
 */
module.exports = function() {
    getId(function(err, fileId, dir) {
        if (err) {
            handleError(err);
        } else {
            parseIncludeFile(function(err, include) {
                if (err) {
                    handleError(err);
                } else {
                    downloadIncludedFiles(include, null, function(err, failed, successful) {
                        if (err) {
                            handleError(err);
                        } else {
                            console.log('Successfully updated ' + successful.length + ' included file(s)');
                            if (failed.length > 0) {
                                console.log('✘'.red + ' Failed to update ' + failed.length + ' file(s), doublecheck if their url(s) are correct and retry')
                                for (fail of failed) {
                                    console.log('    ' + fail);
                                }
                            }
                        }
                    });
                }
            });
        }
    });
}
