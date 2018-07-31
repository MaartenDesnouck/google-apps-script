const constants = require('./constants.js');
const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const getMetadata = require('./functions/getMetadata.js');
const error = require('./functions/error.js');
const displayProjectInfo = require('./functions/displayProjectInfo.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const findInProject = require('./functions/findInProject.js');
const checkbox = require('./functions/checkbox.js');

/**
 * Run a function
 *
 * @param {String} identifier - Id of the project we want to run a function of
 * @param {Object} options - Extra options.
 * @returns {void}
 */
module.exports = async (identifier, options) => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        const projectRoot = await findInProject('.', constants.META_DIR);
        auth = await authenticate([]);

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
        displayProjectInfo(metadata);
        process.exit(0);
    } catch (err) {
        await error.log(err, auth);
        process.exit(1);
    }
};
