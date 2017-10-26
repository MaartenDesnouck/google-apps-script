const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');
const authenticate = require('./functions/authenticate.js');
const getMetadata = require('./functions/getMetadata.js');
const downloadRemote = require('./functions/downloadRemote.js');
const unpackRemote = require('./functions/unpackRemote.js');
const displayCheckbox = require('./functions/displayCheckbox.js');
const handleError = require('./functions/handleError.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const getProjectRoot = require('./functions/getProjectRoot.js');

/**
 * Clone a remote Google Apps Script project
 *
 * @param {string} identifier - Identifier of the project we want to clone.
 * @returns {void}
 */
module.exports = (identifier) => {
    const gotProjectRoot = getProjectRoot('.');

    const checkedVersion = checkNewVersion();

    const output = Promise.all([checkedVersion, ]).then(() => {
        process.stdout.write('Cloning from Google Drive...');
    });

    const gotId = Promise.all([gotProjectRoot, output, ]).then((values) => {
        if (values[0].found) {
            return new Promise((resolve, reject) => {
                displayCheckbox('red');
                process.stdout.write(`You seem to be cloning a project inside another project. Cowardly chose not to do that.`);
                reject({
                    function: 'clone',
                    text: `Cloning inside another project`,
                    output: false,
                });
            });
        } else {
            return new Promise((resolve, reject) => {
                resolve();
            });
        }
    });

    const gotAuth = Promise.all([gotId, ]).then(() => {
        return authenticate([]);
    });

    const gotMetadata = Promise.all([gotAuth, ]).then((values) => {
        return getMetadata(values[0], identifier);
    });

    const downloaded = Promise.all([gotAuth, gotMetadata, ]).then((values) => {
        const metadata = values[1];
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Cloning \'${metadata.name}\' from Google Drive...`);
        return downloadRemote(values[0], metadata.id, metadata.name, 'clone');
    });

    const unpacked = Promise.all([downloaded, gotMetadata, ]).then((values) => {
        return unpackRemote(path.join(process.cwd(), values[1].name), null);
    });

    unpacked.then(() => {
        displayCheckbox('green');
        return;
    }).catch((err) => {
        handleError(err, true);
        return;
    });
};
