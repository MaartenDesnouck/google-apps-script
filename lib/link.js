const readline = require('readline');
const constants = require('./constants.js');
const authenticate = require('./functions/authenticate.js');
const getMetadata = require('./functions/getMetadata.js');
const downloadRemote = require('./functions/downloadRemote.js');
const error = require('./functions/error.js');
const checkbox = require('./functions/checkbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const findInProject = require('./functions/findInProject.js');

/**
 * Link a remote Google Apps Script project to the current folder
 *
 * @param {String} identifier - Identifier of the remote project to link to the current folder.
 * @returns {void}
 */
module.exports = async (identifier) => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        process.stdout.write('Linking to this folder...');
        auth = await authenticate([]);
        const projectRoot = await findInProject('.', constants.META_DIR);

        if (projectRoot.found && projectRoot.folder !== '.') {
            throw {
                message: `You seem to be linking a project inside another project. Cowardly chose not to do that.\n` +
                    `If you are sure you are not in another project you can execute 'gas unlink' to unlink the remote project.\n`,
                print: true,
            };
        }

        const metadata = await getMetadata(auth, identifier);

        readline.clearLine(process.stdout);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Linking '${metadata.name}' to this folder...`);
        const downloaded = await downloadRemote(auth, metadata.projectId, '.', 'link');

        checkbox.display('green');
        process.exit(0);
    } catch (err) {
        checkbox.display('red');
        await error.log(err, auth);
        process.exit(1);
    }
};
