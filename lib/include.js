var parseIncludeFile = require('./functions/parseIncludeFile.js');
var downloadIncludedFiles = require('./functions/downloadIncludedFiles.js');
var handleError = require('./functions/handleError.js');
var getId = require('./functions/getId.js');
var colors = require('colors');
var readline = require('readline');

/**
 * Download included Google Apps Script files to INLCUDED folder
 */
module.exports = function() {
    process.stdout.write('Downloading included files...');
    getId(function(err, fileId, dir) {
        if (err) {
            process.stdout.write(' [' + '✘'.red + ']\n');
            handleError(err);
        } else {
            parseIncludeFile(function(err, include) {
                if (err) {
                    process.stdout.write(' [' + '✘'.red + ']\n');
                    handleError(err);
                } else {
                    downloadIncludedFiles(include, null, function(err, failed, successful) {
                        if (err) {
                            process.stdout.write(' [' + '✘'.red + ']\n');
                            handleError(err);
                        } else {
                            process.stdout.write(' [' + '✔'.green + ']\n');
                            process.stdout.write('Successfully updated ' + successful.length + ' included file(s)\n');
                            if (failed.length > 0) {
                                process.stdout.write(' [' + '✘'.red + ']\n');
                                process.stdout.write('Failed to update ' + failed.length + ' file(s), doublecheck if their url(s) are correct and retry\n')
                                for (fail of failed) {
                                    process.stdout.write('    ' + fail + '\n');
                                }
                            }
                        }
                    });
                }
            });
        }
    });
}
