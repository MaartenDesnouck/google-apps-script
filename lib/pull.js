const readline = require('readline');
const constants = require('./constants.js');
const authenticate = require('./functions/authenticate.js');
const downloadRemote = require('./functions/downloadRemote.js');
const unpackRemote = require('./functions/unpackRemote.js');
const getMetadata = require('./functions/getMetadata.js');
const getId = require('./functions/getId.js');
const error = require('./functions/error.js');
const checkbox = require('./functions/checkbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const findInProject = require('./functions/findInProject.js');

/**
 * Pull code from a linked remote Google Apps Script project
 *
 * @param {Object} fileName - Optional fileName to pull.
 * @returns {void}
 */
module.exports = async (fileName) => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        process.stdout.write('Pulling from remote ...');
        auth = await authenticate([]);
        const projectRoot = await findInProject('.', constants.META_DIR);

        if (!projectRoot.found) {
            throw {
                message: `Can't seem to find a Google Apps Script project here`,
                print: true,
            };
        }

        const id = await getId(projectRoot.folder);
        const metadata = await getMetadata(auth, id);

        readline.clearLine(process.stdout);
        readline.cursorTo(process.stdout, 0);
        if (fileName) {
            process.stdout.write(`Pulling '${metadata.name} > ${fileName}' from remote ...`);
        } else {
            process.stdout.write(`Pulling '${metadata.name}' from remote ...`);
        }

        const downloaded = await downloadRemote(auth, id, projectRoot.folder, 'pull');
        const unpacked = await unpackRemote(projectRoot.folder, fileName);

        checkbox.display('green');
        process.exit(0);

    } catch (err) {
        checkbox.display('red');
        await error.log(err, auth);
        process.exit(1);
    }
};
