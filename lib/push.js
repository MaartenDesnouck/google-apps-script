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

    const gotId = gotProjectRoot.then((value) => {
        if (value.found) {
            return getId(null, value.folder);
        } else {
            return new Promise((resolve, reject) => {
                process.stdout.write(`Can't seem to find a Google Apps Script project here.`);
                displayCheckbox('red');
                reject({
                    function: 'push',
                    text: `Can't find .gas folder`,
                    output: false,
                });
            });
        }
    });

    let auth;
    let fileId;
    let rootFolder;
    const gotMetadata = Promise.all([gotAuth, gotId, checkedVersion, output, ]).then((values) => {
        auth = values[0];
        fileId = values[1];
        return getMetadata(values[0], values[1]);
    });

    const downloaded = Promise.all([gotAuth, gotId, gotProjectRoot, gotMetadata, ]).then((values) => {
        return downloadRemote(values[0], values[1], values[2].folder, 'pull');
    });

    const packed = Promise.all([gotProjectRoot, gotMetadata, ]).then((values) => {
        return packLocal(values[0].folder);
    });

    const pushed = Promise.all([gotAuth, gotId, gotProjectRoot, downloaded, packed, ]).then((values) => {
        rootFolder = values[2].folder;
        console.log(rootFolder);
        return pushToRemote(auth, fileId, 'local', values[2].folder);
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
