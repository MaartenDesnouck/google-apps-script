const path = require('path');
const readline = require('readline');
const constants = require('./constants.js');
const authenticate = require('./functions/authenticate.js');
const getMetadata = require('./functions/getMetadata.js');
const downloadRemote = require('./functions/downloadRemote.js');
const unpackRemote = require('./functions/unpackRemote.js');
const checkbox = require('./functions/checkbox.js');
const error = require('./functions/error.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const findInProject = require('./functions/findInProject.js');

/**
 * Clone a remote Google Apps Script project
 *
 * @param {String} identifier - Identifier of the project we want to clone.
 * @returns {void}
 */
module.exports = async (identifier) => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        process.stdout.write(`Cloning remote '${identifier}' ...`);
        auth = await authenticate([]);

        const projectRoot = await findInProject('.', constants.META_DIR);

        if (projectRoot.found) {
            throw {
                message: 'You seem to be cloning a project inside another project. Cowardly chose not to do that.',
                print: true,
            };
        }

        const metadata = await getMetadata(auth, identifier);
        readline.clearLine(process.stdout);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Cloning remote '${metadata.name}' ...`);

        const downloaded = await downloadRemote(auth, metadata.projectId, metadata.name, 'clone');
        const unpacked = await unpackRemote(path.join(process.cwd(), metadata.name), null);

        checkbox.display('green');
    } catch (err) {
        checkbox.display('red');
        await error.log(err, auth);
        process.exit(1);
    }
    process.exit(0);
};
