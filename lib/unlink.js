const fs = require('fs-extra');
const path = require('path');
const constants = require('./constants.js');
const error = require('./functions/error.js');
const checkbox = require('./functions/checkbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const findInProject = require('./functions/findInProject.js');

/**
 * Unlink the remote Google Apps Script project from the current folder
 *
 * @returns {void}
 */
module.exports = async () => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        process.stdout.write('Unlinking remote project...');
        const projectRoot = await findInProject('.', constants.META_DIR);

        if (!projectRoot.found) {
            throw {
                message: `Can't seem to find a Google Apps Script project here`,
                print: true,
            };
        }

        fs.removeSync(path.join(projectRoot.folder, constants.META_DIR));
        checkbox.display('green');
        process.exit(0);
    } catch (err) {
        checkbox.display('red');
        await error.log(err, auth);
        process.exit(1);
    }
};
