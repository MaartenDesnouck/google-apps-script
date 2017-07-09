const readline = require('readline');
const authenticate = require('./functions/authenticate.js');
const parseIncludeFile = require('./functions/parseIncludeFile.js');
const downloadIncludedFiles = require('./functions/downloadIncludedFiles.js');
const handleError = require('./functions/handleError.js');
const getId = require('./functions/getId.js');
const printCheckbox = require('./functions/printCheckbox.js');

/**
 * Download included Google Apps Script files to INLCUDED folder-
 * @returns {void}
 */
module.exports = () => {
    process.stdout.write('Downloading included files...');
    authenticate([], (err, auth) => {
        if (err) {
            handleError(auth, err, false);
        } else {
            getId((err, fileId, dir) => {
                if (err) {
                    handleError(auth, err, true);
                } else {
                    parseIncludeFile((err, include) => {
                        if (err) {
                            handleError(auth, err, true);
                        } else {
                            downloadIncludedFiles(include, null, (err, failed, successful) => {
                                if (err) {
                                    handleError(auth, err, true);
                                } else {
                                    printCheckbox('green');
                                    process.stdout.write(`Successfully updated ${successful.length} included file(s)\n`);
                                    if (failed.length > 0) {
                                        printCheckbox('red');
                                        process.stdout.write(`Failed to update ${failed.length} file(s), doublecheck if their url(s) are correct and retry\n`);
                                        for (const fail of failed) {
                                            process.stdout.write(`    ${fail}\n`);
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};
