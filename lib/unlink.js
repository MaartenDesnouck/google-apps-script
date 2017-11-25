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
module.exports = () => {
    const gotProjectRoot = getProjectRoot('.');

    const checkedVersion = checkNewVersion();

    const output = Promise.all([checkedVersion, ]).then(() => {
        process.stdout.write('Unlinking remote project...');
    });

    const unlinked = Promise.all([gotProjectRoot, output, ]).then((values) => {
        if (values[0].found) {
            fs.removeSync(path.join(values[0].folder, constants.META_DIR));
            return new Promise((resolve, reject) => {
                resolve();
            });
        } else {
            return new Promise((resolve, reject) => {
                displayCheckbox('red');
                process.stdout.write(`Can't find any project to unlink.`);
                reject({
                    function: 'unlink',
                    text: `No linked project found to unlink.`,
                    output: false,
                });
            });
        }
    });

    unlinked.then(() => {
        displayCheckbox('green');
        return;
    }).catch((err) => {
        handleError(err, true);
    });
};
