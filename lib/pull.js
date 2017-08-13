const readline = require('readline');
const include = require('./include.js');
const authenticate = require('./functions/authenticate.js');
const downloadRemote = require('./functions/downloadRemote.js');
const unpackRemote = require('./functions/unpackRemote.js');
const getMetadata = require('./functions/getMetadata.js');
const getId = require('./functions/getId.js');
const handleError = require('./functions/handleError.js');
const displayCheckbox = require('./functions/displayCheckbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const getProjectRoot = require('./functions/getProjectRoot.js');

/**
 * Pull code from a linked remote Google Apps Script project
 *
 * @param {object} options - Extra options.
 * @returns {void}
 */
module.exports = (options) => {
    const gotProjectRoot = getProjectRoot('.');

    const checkedVersion = checkNewVersion();

    const output = Promise.all([checkedVersion, ]).then(() => {
        process.stdout.write('Pulling from Google Drive...');
    });

    const gotAuth = Promise.all([output, ]).then(() => {
        return authenticate([]);
    });

    const gotId = Promise.all([gotProjectRoot, output, gotAuth, ]).then((values) => {
        if (values[0].found) {
            return getId(values[0].folder);
        } else {
            return new Promise((resolve, reject) => {
                displayCheckbox('red');
                process.stdout.write(`Can't seem to find a Google Apps Script project here.`);
                reject({
                    function: 'pull',
                    text: `Can't find .gas folder`,
                    output: false,
                });
            });
        }
    });

    const gotMetadata = Promise.all([gotAuth, gotId, ]).then((values) => {
        return getMetadata(values[0], values[1]);
    });

    const downloaded = Promise.all([gotAuth, gotId, gotMetadata, gotProjectRoot, ]).then((values) => {
        process.stdout.clearLine();
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Pulling \'${values[2].name}\' from Google Drive...`);
        return downloadRemote(values[0], values[1], values[3].folder, 'pull');
    });

    const unpacked = Promise.all([gotProjectRoot, downloaded, ]).then((values) => {
        return unpackRemote(values[0].folder);
    });

    unpacked.then(() => {
        displayCheckbox('green');
        if (options.include) {
            include();
        }
        return;
    }).catch((err) => {
        handleError(err, true);
        return;
    });
};
