const openWebpage = require('open');
const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const getMetadata = require('./functions/getMetadata.js');
const handleError = require('./functions/handleError.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const getProjectRoot = require('./functions/getProjectRoot.js');
const displayCheckbox = require('./functions/displayCheckbox.js');

/**
 * Open a local project in the online editor.
 *
 * @param {string} identifier - Id of the project we want to open.
 * @returns {void}
 */
module.exports = (identifier) => {
    const checkedVersion = checkNewVersion();
    const gotAuth = authenticate([]);
    const gotProjectRoot = getProjectRoot('.');

    const gotId = gotProjectRoot.then((value) => {
        if (identifier) {
            return new Promise((resolve, reject) => {
                resolve(identifier);
            });
        } else {
            if (value.found) {
                return getId(value.folder);
            } else {
                return new Promise((resolve, reject) => {
                    process.stdout.write(`Can't seem to find a Google Apps Script project here.`);
                    displayCheckbox('red');
                    reject({
                        function: 'open',
                        text: `Can't find .gas folder`,
                        output: false,
                    });
                });
            }
        }
    });

    const gotMetadata = Promise.all([gotAuth, gotId, checkedVersion, ]).then((values) => {
        return getMetadata(values[0], values[1]);
    });

    gotMetadata.then((metadata) => {
        openWebpage(`https://script.google.com/d/${metadata.id}/edit?usp=drive_web`);
    }).catch((err) => {
        handleError(err, false);
        return;
    });
};
