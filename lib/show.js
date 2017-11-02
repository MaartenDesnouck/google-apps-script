const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const getMetadata = require('./functions/getMetadata.js');
const handleError = require('./functions/handleError.js');
const displayProjectInfo = require('./functions/displayProjectInfo.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const getProjectRoot = require('./functions/getProjectRoot.js');
const displayCheckbox = require('./functions/displayCheckbox.js');

/**
 * Display info about a google apps script project
 *
 * @param {string} identifier - Id of the project we want info about.
 * @returns {void}
 */
module.exports = (identifier) => {
    const checkedVersion = checkNewVersion();

    const gotProjectRoot = getProjectRoot('.');

    const gotAuth = Promise.all([checkedVersion, ]).then(() => {
        return authenticate([]);
    });

    const gotId = Promise.all([checkedVersion, gotProjectRoot, gotAuth, ]).then((values) => {
        if (identifier) {
            return new Promise((resolve, reject) => {
                resolve(identifier);
            });
        } else if (values[1].found) {
            return getId(values[1].folder);
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
    });

    const gotMetadata = Promise.all([gotAuth, gotId, ]).then((values) => {
        return getMetadata(values[0], values[1]);
    });

    gotMetadata.then((metadata) => {
        return displayProjectInfo(metadata);
    }).catch((err) => {
        handleError(err, false);
    });
};
