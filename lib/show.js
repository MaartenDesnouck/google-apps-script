const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const getMetadata = require('./functions/getMetadata.js');
const error = require('./functions/error.js');
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
module.exports = async(identifier) => {
    const checkedVersion = await checkNewVersion();
    const projectRoot = await getProjectRoot('.');
    const auth = await authenticate([]);

    let id;
    if (identifier) {
        id = identifier;
    } else if (projectRoot.found) {
        id = await getId(projectRoot.folder);
    } else {
        process.stdout.write(`Can't seem to find a Google Apps Script project here.`);
        displayCheckbox('red');
        return;
    }

    const metadata = await getMetadata(auth, id);
    displayProjectInfo(metadata);
};
