const pull = require('./pull.js');
const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const packLocal = require('./functions/packLocal.js');
const pushToRemote = require('./functions/pushToRemote.js');
const downloadRemote = require('./functions/downloadRemote.js');
const getMetadata = require('./functions/getMetadata.js');
const handleError = require('./functions/handleError.js');
const displayCheckbox = require('./functions/displayCheckbox.js');
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

    const output = checkedVersion.then(() => {
        process.stdout.write('Pushing code to Google Drive...');
    });

    let auth;
    let fileId;
    const gotMetadata = Promise.all([gotAuth, gotId, checkedVersion, output, ]).then((values) => {
        auth = values[0];
        fileId = values[1];
        return getMetadata(values[0], values[1]);
    });

    const downloaded = Promise.all([gotAuth, gotId, gotMetadata, ]).then((values) => {
        return downloadRemote(values[0], values[1], '.', 'pull');
    });

    const packed = Promise.all([gotMetadata, ]).then(() => {
        return packLocal('.');
    });

    const pushed = Promise.all([gotAuth, gotId, downloaded, packed, ]).then((values) => {
        return pushToRemote(auth, fileId, 'local');
    });

    pushed.then((values) => {
        displayCheckbox('green');
        return;
    }).catch((err) => {
        // We need to revert and after that show the error
        return pushToRemote(auth, fileId, 'remote').then(() => {
            handleError(err, true);
        });
    });
};
