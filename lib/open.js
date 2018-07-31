const open = require('opn');
const constants = require('./constants.js');
const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const getMetadata = require('./functions/getMetadata.js');
const error = require('./functions/error.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const findInProject = require('./functions/findInProject.js');
const checkbox = require('./functions/checkbox.js');

/**
 * Open a local project in the online editor.
 *
 * @param {String} identifier - Id of the project we want to open.
 * @returns {void}
 */
module.exports = async (identifier) => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        auth = await authenticate([]);
        const projectRoot = await findInProject('.', constants.META_DIR);

        let id;
        if (identifier) {
            id = identifier;
        } else if (projectRoot.found) {
            id = await getId(projectRoot.folder);
        } else {
            throw {
                message: `Can't seem to find a Google Apps Script project here`,
                print: true,
            };
        }

        const metadata = await getMetadata(auth, id);
        open(`https://script.google.com/d/${metadata.projectId}/edit`);
        process.exit(0);
    } catch (err) {
        checkbox.display('red');
        await error.log(err, auth);
        process.exit(1);
    }
};
