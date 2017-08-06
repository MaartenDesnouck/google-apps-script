const openWebpage = require('open');
const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const getMetadata = require('./functions/getMetadata.js');
const handleError = require('./functions/handleError.js');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Open a local project in the online editor.
 *
 * @param {string} identifier - Id of the project we want to open.
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
        openWebpage(`https://script.google.com/d/${metadata.id}/edit?usp=drive_web`);
    }).catch((err) => {
        handleError(err, true);
        return;
    });
};
