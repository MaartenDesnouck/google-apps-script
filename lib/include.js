const readline = require('readline');
const authenticate = require('./functions/authenticate.js');
const parseIncludeFile = require('./functions/parseIncludeFile.js');
const downloadIncludedFiles = require('./functions/downloadIncludedFiles.js');
const handleError = require('./functions/handleError.js');
const getId = require('./functions/getId.js');
const printCheckbox = require('./functions/printCheckbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Download included Google Apps Script files to INLCUDED folder-
 * @returns {void}
 */
module.exports = () => {
    const checkedVersion = checkNewVersion();
    const gotAuth = authenticate([]);
    const gotId = getId();
    const parsed = parseIncludeFile();

    checkedVersion.then(() => {
        process.stdout.write('Downloading included files...');
    });

    const downloaded = parsed.then((include) => {
        return downloadIncludedFiles(include, null);
    });

    downloaded.then((result) => {
        process.stdout.write(`Successfully updated ${result.successful.length} included file(s)\n`);
        if (result.failed.length > 0) {
            printCheckbox('red');
            process.stdout.write(`Failed to update ${result.failed.length} file(s), doublecheck if their url(s) are correct and retry\n`);
            for (const fail of result.failed) {
                process.stdout.write(`    ${fail}\n`);
            }
        }
    });

    // Catch all the errors
    gotAuth.then((auth) => {
        Promise.all([gotId, downloaded, checkedVersion, ]).catch((err) => {
            handleError(auth, err, false);
            return;
        });
    }).catch((err) => {
        handleError(null, err, false);
        return;
    });
};
