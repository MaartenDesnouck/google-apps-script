const readline = require('readline');
const authenticate = require('./functions/authenticate.js');
const getMetadata = require('./functions/getMetadata.js');
const downloadRemote = require('./functions/downloadRemote.js');
const handleError = require('./functions/handleError.js');
const displayCheckbox = require('./functions/displayCheckbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const getProjectRoot = require('./functions/getProjectRoot.js');

/**
 * Link a remote Google Apps Script project to the current folder
 *
 * @param {string} identifier - Identifier of the remote project to link to the current folder.
 * @returns {void}
 */
module.exports = (identifier) => {
    const gotProjectRoot = getProjectRoot('.');

    const checkedVersion = checkNewVersion();

    const output = Promise.all([checkedVersion, ]).then(() => {
        process.stdout.write('Linking to this folder...');
    });

    const gotId = Promise.all([gotProjectRoot, output, ]).then((values) => {
        if (!values[0].found || (values[0].found && values[0].folder === '.')) {
            return new Promise((resolve, reject) => {
                resolve();
            });
        } else {
            return new Promise((resolve, reject) => {
                displayCheckbox('red');
                process.stdout.write(`You seem to be linking a project inside another project. Cowardly chose not to do that.`);
                reject({
                    function: 'link',
                    text: `Linking inside another project`,
                    output: false,
                });
            });
        }
    });

    const gotAuth = Promise.all([gotId, ]).then(() => {
        return authenticate([]);
    });

    const gotMetadata = Promise.all([gotAuth, ]).then((values) => {
        return getMetadata(values[0], identifier);
    });

    const downloaded = Promise.all([gotMetadata, gotAuth, ]).then((values) => {
        const metadata = values[0];
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Linking '${metadata.name}' to this folder...`);
        return downloadRemote(values[1], metadata.id, '.', 'link');
    });

    downloaded.then(() => {
        displayCheckbox('green');
    }).catch((err) => {
        handleError(err, true);
        return;
    });
};
