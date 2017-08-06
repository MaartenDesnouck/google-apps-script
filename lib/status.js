const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const getMetadata = require('./functions/getMetadata.js');
const handleError = require('./functions/handleError.js');
const packLocal = require('./functions/packLocal.js');
const downloadRemote = require('./functions/downloadRemote.js');
const displayStatusInfo = require('./functions/displayStatusInfo.js');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Display info about a google apps script project
 *
 * @param {string} identifier - Id of the project we want info about.
 * @returns {void}
 */
module.exports = () => {
    const checkedVersion = checkNewVersion();
    const gotAuth = authenticate([]);
    const gotId = getId();

    const gotMetadata = Promise.all([gotAuth, gotId, checkedVersion, ]).then((values) => {
        return getMetadata(values[0], values[1]);
    });

    const downloaded = Promise.all([gotMetadata, gotAuth, gotId, ]).then((values) => {
        return downloadRemote(values[1], values[2], '.', 'pull');
    });

    const packed = gotMetadata.then(() => {
        return packLocal('.');
    });

    Promise.all([downloaded, packed, gotMetadata, ]).then((values) => {
        return displayStatusInfo(values[2]);
    }).catch((err) => {
        handleError(err, true);
        return;
    });
};
