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
    checkNewVersion().then(() => {
        return authenticate(options);
    }).then(auth => {
        return getId();
    }).then(id => {
        return parseIncludeFile();
    }).then(include => {
        return downloadIncludedFiles(include, null);
    }).then(result => {
        process.stdout.write(`Successfully updated ${result.successful.length} included file(s)\n`);
        if (result.failed.length > 0) {
            printCheckbox('red');
            process.stdout.write(`Failed to update ${result.failed.length} file(s), doublecheck if their url(s) are correct and retry\n`);
            for (const fail of failed) {
                process.stdout.write(`    ${fail}\n`);
            }
        }
    }).catch(err => {
        handleError(auth, err, false);
    });
};
