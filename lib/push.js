const pull = require('./pull.js');
const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const packLocal = require('./functions/packLocal.js');
const pushToRemote = require('./functions/pushToRemote.js');
const downloadRemote = require('./functions/downloadRemote.js');
const getMetadata = require('./functions/getMetadata.js');
const handleError = require('./functions/handleError.js');
const printCheckbox = require('./functions/printCheckbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Push all local code to the remote Google Apps Script project
 *
 * @returns {void}
 */
module.exports = () => {
    const checkedVersion = checkNewVersion();
    const gotAuth = authenticate([]);
    const gotId = getId();

    checkedVersion.then(() => {
        process.stdout.write('Pushing code to Google Drive...');
    });

    const gotMetadata = Promise.all([gotAuth, gotId, checkedVersion, ]).then((values) => {
        return getMetadata(values[0], values[1]);
    });

    const downloaded = Promise.all([gotMetadata, gotAuth, gotId, ]).then((values) => {
        return downloadRemote(values[1], values[2], '.', 'pull');
    });

    const packed = gotMetadata.then(() => {
        return packLocal('.');
    });

    let auth;
    let fileId;
    const pushed = Promise.all([gotAuth, gotId, downloaded, packed, ]).then((values) => {
        auth = values[0];
        fileId = values[1];
        return pushToRemote(auth, fileId, 'local');
    });

    pushed.then((values) => {
        printCheckbox('green');
        return;
    }).catch((err) => {
        // We need to revert and after that show the error
        return pushToRemote(auth, fileId, 'remote').then(() => {
            handleError(auth, err, true);
        });
    });

    // Catch all the errors
    gotAuth.then((auth) => {
        Promise.all([gotId, gotMetadata, packed, checkedVersion, ]).catch((err) => {
            handleError(auth, err, true);
            return;
        });
    }).catch((err) => {
        handleError(null, err, true);
        return;
    });
};
