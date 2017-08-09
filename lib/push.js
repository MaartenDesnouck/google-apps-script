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
const getProjectRoot = require('./functions/getProjectRoot.js');

/**
 * Push all local code to the remote Google Apps Script project
 *
 * @returns {void}
 */
module.exports = () => {
    const checkedVersion = checkNewVersion();
    const gotAuth = authenticate([]);
    const gotProjectRoot = getProjectRoot('.');

    const output = checkedVersion.then(() => {
        process.stdout.write('Pushing code to Google Drive...');
    });

    const gotId = Promise.all([gotProjectRoot, output, ]).then((values) => {
        if (values[0].found) {
            return getId(values[0].folder);
        } else {
            return new Promise((resolve, reject) => {
                displayCheckbox('red');
                process.stdout.write(`Can't seem to find a Google Apps Script project here.`);
                reject({
                    function: 'push',
                    text: `Can't find .gas folder`,
                    output: false,
                });
            });
        }
    });

    const gotMetadata = Promise.all([gotAuth, gotId, checkedVersion, output, ]).then((values) => {
        return getMetadata(values[0], values[1]);
    });

    const downloaded = Promise.all([gotAuth, gotId, gotProjectRoot, gotMetadata, ]).then((values) => {
        return downloadRemote(values[0], values[1], values[2].folder, 'pull');
    });

    const packed = Promise.all([gotProjectRoot, gotMetadata, ]).then((values) => {
        return packLocal(values[0].folder);
    });

    const pushed = Promise.all([gotAuth, gotId, gotProjectRoot, downloaded, packed, ]).then((values) => {
        return pushToRemote(values[0], values[1], 'local', values[2].folder);
    });

    pushed.then((values) => {
        displayCheckbox('green');
        return;
    }).catch((err) => {
        handleError(err, true);
    });
};
