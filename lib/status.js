const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const getMetadata = require('./functions/getMetadata.js');
const handleError = require('./functions/handleError.js');
const packLocal = require('./functions/packLocal.js');
const downloadRemote = require('./functions/downloadRemote.js');
const displayStatusInfo = require('./functions/displayStatusInfo.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const getProjectRoot = require('./functions/getProjectRoot.js');
const displayCheckbox = require('./functions/displayCheckbox.js');

/**
 * Display info about a google apps script project
 *
 * @param {string} identifier - Id of the project we want info about.
 * @returns {void}
 */
module.exports = () => {
    const checkedVersion = checkNewVersion();

    const gotProjectRoot = getProjectRoot('.');

    const gotAuth = Promise.all([checkedVersion, ]).then(() => {
        return authenticate([]);
    });

    const gotId = Promise.all([checkedVersion, gotProjectRoot, gotAuth, ]).then((values) => {
        if (values[1].found) {
            return getId(values[1].folder);
        } else {
            return new Promise((resolve, reject) => {
                process.stdout.write(`Can't seem to find a Google Apps Script project here.`);
                displayCheckbox('red');
                reject({
                    function: 'status',
                    text: `Can't find .gas folder`,
                    output: false,
                });
            });
        }
    });

    const gotMetadata = Promise.all([gotAuth, gotId, checkedVersion, ]).then((values) => {
        return getMetadata(values[0], values[1]);
    });

    const downloaded = Promise.all([gotAuth, gotId, gotMetadata, gotProjectRoot, ]).then((values) => {
        return downloadRemote(values[0], values[1], values[3].folder, 'pull');
    });

    const packed = Promise.all([gotProjectRoot, gotMetadata, ]).then((values) => {
        return packLocal(values[0].folder);
    });

    Promise.all([gotProjectRoot, gotMetadata, downloaded, packed, ]).then((values) => {
        return displayStatusInfo(values[0].folder, values[1]);
    }).catch((err) => {
        handleError(err, false);
    });
};
