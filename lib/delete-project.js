const constants = require('./constants.js');
const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const getMetadata = require('./functions/getMetadata.js');
const remoteDeleteProject = require('./functions/remoteDeleteProject.js');
const findInProject = require('./functions/findInProject.js');
const error = require('./functions/error.js');
const checkbox = require('./functions/checkbox.js');
const readline = require('readline');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Delete a remote Google Apps Script project
 *
 * @param {String} identifier - Id of the project we want to delete.
 * @param {Object} options - Extra options.
 * @returns {void}
 */
module.exports = async (identifier, options) => {
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
        readline.clearLine(process.stdout);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Deleting remote script '${metadata.name}' ...`);
        const deleted = await remoteDeleteProject(auth, metadata.projectId, metadata.name);

        checkbox.display('green');
        process.exit(0);
    } catch (err) {
        checkbox.display('red');
        await error.log(err, auth);
        process.exit(1);
    }
};
