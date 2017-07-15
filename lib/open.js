const openWebpage = require('open');
const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const getMetadata = require('./functions/getMetadata.js');
const handleError = require('./functions/handleError.js');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Open a local project in the online editor.
 *
 * @param {string} fileId - Id of the project we want to open.
 * @returns {void}
 */
module.exports = (identifier) => {
    var checkedVersion = checkNewVersion();
    var gotAuth = authenticate([]);
    var gotId = getId(identifier);

    var gotMetadata = Promise.all([gotAuth, gotId, checkedVersion]).then(values => {
        return getMetadata(values[0], values[1]);
    });

    gotMetadata.then(value => {
        openWebpage(`https://script.google.com/d/${value.id}/edit?usp=drive_web`);
    });

    // Catch all the errors
    Promise.all([gotAuth, gotId, gotMetadata, checkedVersion]).catch(err => {
        if (value[0]) {
            handleError(value[0], err, false);
        } else {
            handleError(null, err, false);
        }
    });
};
