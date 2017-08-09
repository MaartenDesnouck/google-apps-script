const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const getMetadata = require('./functions/getMetadata.js');
const handleError = require('./functions/handleError.js');
const displayProjectInfo = require('./functions/displayProjectInfo.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const getProjectRoot = require('./functions/getProjectRoot.js');

/**
 * Display info about a google apps script project
 *
 * @param {string} identifier - Id of the project we want info about.
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
                        function: 'show',
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
        return displayProjectInfo(metadata);
    }).catch((err) => {
        handleError(err, true);
        return;
    });
};
