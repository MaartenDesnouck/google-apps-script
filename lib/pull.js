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

/**
 * Pull code from a linked remote Google Apps Script project
 *
 * @param {object} options - Extra options.
 * @returns {void}
 */
module.exports = (options) => {
    const checkedVersion = checkNewVersion();
    const gotAuth = authenticate([]);
    const gotId = getId();

    checkedVersion.then(() => {
        process.stdout.write('Pulling from Google Drive...');
    });

    const gotMetadata = Promise.all([gotAuth, gotId, checkedVersion, ]).then((values) => {
        return getMetadata(values[0], values[1]);
    });

    const downloaded = Promise.all([gotAuth, gotId, gotMetadata, ]).then((values) => {
        process.stdout.clearLine();
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Pulling \'${values[2].name}\' from Google Drive...`);
        return downloadRemote(values[0], values[1], '.', 'pull');
    });

    const unpacked = downloaded.then(() => {
        return unpackRemote('.');
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
