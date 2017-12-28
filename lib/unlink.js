const fs = require('fs-extra');
const path = require('path');
const constants = require('./constants.js');
const error = require('./functions/error.js');
const displayCheckbox = require('./functions/displayCheckbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const getProjectRoot = require('./functions/getProjectRoot.js');

/**
 * Unlink the remote Google Apps Script project from the current folder
 *
 * @returns {void}
 */
module.exports = async() => {
    try {
        const checkedVersion = await checkNewVersion();
        const projectRoot = await getProjectRoot('.');

        process.stdout.write('Unlinking remote project...');

        if (!projectRoot.found) {
            displayCheckbox('red');
            process.stdout.write(`Can't find any project to unlink.`);
            return;
        }

        fs.removeSync(path.join(projectRoot.folder, constants.META_DIR));
        displayCheckbox('green');
        process.exit(0);
    } catch (err) {
        displayCheckbox('red');
        await error.handle(err);
        process.exit(1);
    }
};
