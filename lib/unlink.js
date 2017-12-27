const fs = require('fs-extra');
const path = require('path');
const constants = require('./constants.js');
const handleError = require('./functions/handleError.js');
const displayCheckbox = require('./functions/displayCheckbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const getProjectRoot = require('./functions/getProjectRoot.js');

/**
 * Unlink the remote Google Apps Script project from t current folder
 *
 * @returns {void}
 */
module.exports = async() => {
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
    return;
};
