const readline = require('readline');
const authenticate = require('./functions/authenticate.js');
const parseIncludeFile = require('./functions/parseIncludeFile.js');
const downloadIncludedFiles = require('./functions/downloadIncludedFiles.js');
const error = require('./functions/error.js');
const getId = require('./functions/getId.js');
const displayCheckbox = require('./functions/displayCheckbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Download included Google Apps Script files to includeDir folder
 *
 * @returns {void}
 */
module.exports = async() => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        process.stdout.write(`Downloading included files...`);
        auth = await authenticate([]);
        const parsed = await parseIncludeFile();
        const downloaded = await downloadIncludedFiles(parsed, null);

        displayCheckbox('green');
        process.stdout.write(`${downloaded.successful.length} included file(s) were successfully updated`);
        displayCheckbox('green');
        if (downloaded.failed.length > 0) {
            displayCheckbox('red');
            process.stdout.write(`${downloaded.failed.length} included file(s) failed, doublecheck if their url(s) are correct and retry`);
            displayCheckbox('red');
            for (const fail of downloaded.failed) {
                process.stdout.write(`   - ${fail}\n`);
            }
        }
        process.exit(0);
    } catch (err) {
        displayCheckbox('red');
        await error.log(err, auth);
        process.exit(1);
    }
};
