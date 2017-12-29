const readline = require('readline');
const authenticate = require('./functions/authenticate.js');
const parseIncludeFile = require('./functions/parseIncludeFile.js');
const downloadIncludedFiles = require('./functions/downloadIncludedFiles.js');
const error = require('./functions/error.js');
const getId = require('./functions/getId.js');
const checkbox = require('./functions/checkbox.js');
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

        checkbox.display('green');
        process.stdout.write(`${downloaded.successful.length} included file(s) were successfully updated`);
        checkbox.display('green');
        if (downloaded.failed.length > 0) {
            checkbox.display('red');
            process.stdout.write(`${downloaded.failed.length} included file(s) failed, doublecheck if their url(s) are correct and retry`);
            checkbox.display('red');
            for (const fail of downloaded.failed) {
                process.stdout.write(`   - ${fail}\n`);
            }
        }
        process.exit(0);
    } catch (err) {
        checkbox.display('red');
        await error.log(err, auth);
        process.exit(1);
    }
};
