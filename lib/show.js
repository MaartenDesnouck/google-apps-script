const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const getMetadata = require('./functions/getMetadata.js');
const handleError = require('./functions/handleError.js');
const displayProjectInfo = require('./functions/displayProjectInfo.js');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Display info about a google apps script project
 *
 * @param {string} identifier - Id of the project we want info about.
 * @returns {void}
 */
module.exports = (identifier) => {
    const checkedVersion = checkNewVersion();
    const gotAuth = authenticate([]);
    const gotId = getId(identifier);

    const gotMetadata = Promise.all([gotAuth, gotId, checkedVersion, ]).then((values) => {
        return getMetadata(values[0], values[1]);
    });

    gotMetadata.then((metadata) => {
        return displayProjectInfo(metadata);
    }).catch((err) => {
        handleError(err, true);
        return;
    });
};
