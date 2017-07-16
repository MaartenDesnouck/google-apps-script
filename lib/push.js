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
    process.stdout.write('Pushing code to Google Drive...');
    const checkedVersion = checkNewVersion();
    const gotAuth = authenticate([]);
    const gotId = getId();

    const gotMetadata = Promise.all([gotAuth, gotId, checkedVersion]).then((values) => {
        return getMetadata(values[0], values[1]);
    });

    const packed = gotMetadata.then(() => {
        return packLocal('.');
    });

    const pushed = Promise.all([gotAuth, gotId, packed]).then((values) => {
        return pushToRemote(values[0], values[1]);
    });

    pushed.then(() => {
        printCheckbox('green');
    }).catch(() => {
        // Yeah, we'll need to revert
    })

    // Catch all the errors
    gotAuth.then((auth) => {
        Promise.all([gotId, gotMetadata, packed, pushed, checkedVersion, ]).catch((err) => {
            handleError(auth, err, false);
        });
    }).catch((err) => {
        handleError(null, err, false);
    });
};
