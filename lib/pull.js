const readline = require('readline');
const include = require('./include.js');
const authenticate = require('./functions/authenticate.js');
const downloadRemote = require('./functions/downloadRemote.js');
const unpackRemote = require('./functions/unpackRemote.js');
const getMetadata = require('./functions/getMetadata.js');
const getId = require('./functions/getId.js');
const handleError = require('./functions/handleError.js');
const printCheckbox = require('./functions/printCheckbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Pull code from a linked remote Google Apps Script project
 *
 * @param {object} options - Extra options.
 * @returns {void}
 */
module.exports = (options) => {
    process.stdout.write('Pulling from Google Drive...');
    const checkedVersion = checkNewVersion();
    const gotAuth = authenticate([]);
    const gotId = getId();

    const gotMetadata = Promise.all([gotAuth, gotId, checkedVersion, ]).then((values) => {
        return getMetadata(values[0], values[1]);
    });

    const downloaded = Promise.all([gotMetadata, gotAuth, gotId, ]).then((values) => {
        process.stdout.clearLine();
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Pulling \'${values[0].name}\' from Google Drive...`);
        return downloadRemote(values[1], values[2], '.', 'pull');
    });

    const unpacked = downloaded.then(() => {
        return unpackRemote('.');
    });

    unpacked.then(() => {
        printCheckbox('green');
        if (options.include) {
            include();
        }
        return;
    });

    // Catch all the errors
    gotAuth.then((auth) => {
        Promise.all([gotId, gotMetadata, downloaded, unpacked, checkedVersion, ]).catch((err) => {
            handleError(auth, err, false);
            return;
        });
    }).catch((err) => {
        handleError(null, err, false);
        return;
    });
};
