const pull = require('./pull.js');
const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const packLocal = require('./functions/packLocal.js');
const packLocalSingleFile = require('./functions/packLocalSingleFile.js');
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
 * @param {string} fileName - if defined, only this file will be pushed to remote
 */
module.exports = (fileName) => {
    const checkedVersion = checkNewVersion();

    const gotProjectRoot = getProjectRoot('.');

    const output = Promise.all([checkedVersion, ]).then(() => {
        process.stdout.write('Pushing code to Google Drive...');
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
                    function: 'push',
                    text: `Can't find .gas folder`,
                    output: false,
                });
            });
        }
    });

    const gotMetadata = Promise.all([gotAuth, gotId, ]).then((values) => {
        return getMetadata(values[0], values[1]);
    });

    const downloaded = Promise.all([gotAuth, gotId, gotProjectRoot, gotMetadata, ]).then((values) => {
        return downloadRemote(values[0], values[1], values[2].folder, 'pull');
    });

    const packed = Promise.all([gotProjectRoot, gotMetadata, downloaded, ]).then((values) => {
        if (fileName) {
            return packLocalSingleFile(values[0].folder, fileName);
        } else {
            return packLocal(values[0].folder);
        }
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
