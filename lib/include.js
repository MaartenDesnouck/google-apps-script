const readline = require('readline');
const authenticate = require('./functions/authenticate.js');
const parseIncludeFile = require('./functions/parseIncludeFile.js');
const downloadIncludedFiles = require('./functions/downloadIncludedFiles.js');
const handleError = require('./functions/handleError.js');
const getId = require('./functions/getId.js');
const printCheckbox = require('./functions/printCheckbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Download included Google Apps Script files to includeDir folder
 *
 * @returns {void}
 */
module.exports = () => {
    const checkedVersion = checkNewVersion();
    const gotAuth = authenticate([]);
    const gotId = getId();
    const parsed = parseIncludeFile();

    const checked = checkedVersion.then(() => {
        process.stdout.write('Downloading included files...\n');
    });

    const downloaded = Promise.all([checked, parsed, ]).then((values) => {
        return downloadIncludedFiles(values[1], null);
    });

    downloaded.then((result) => {
        process.stdout.write(`${result.successful.length} included file(s) were successfully updated`);
        printCheckbox('green');
        if (result.failed.length > 0) {
            process.stdout.write(`${result.failed.length} included file(s) failed, doublecheck if their url(s) are correct and retry`);
            printCheckbox('red');
            for (const fail of result.failed) {
                process.stdout.write(`   - ${fail}\n`);
            }
        }
    });

    // Catch all the errors
    gotAuth.then((auth) => {
        Promise.all([gotId, downloaded, checkedVersion, ]).catch((err) => {
            handleError(auth, err, true);
            return;
        });
    }).catch((err) => {
        handleError(null, err, true);
        return;
    });
};
