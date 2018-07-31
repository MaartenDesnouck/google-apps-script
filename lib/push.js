const readline = require('readline');
const constants = require('./constants.js');
const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const pack = require('./functions/pack.js');
const packLocalSingleFile = require('./functions/packLocalSingleFile.js');
const pushToRemote = require('./functions/pushToRemote.js');
const downloadRemote = require('./functions/downloadRemote.js');
const getMetadata = require('./functions/getMetadata.js');
const error = require('./functions/error.js');
const checkbox = require('./functions/checkbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const findInProject = require('./functions/findInProject.js');

/**
 * Push all local code to the remote Google Apps Script project
 *
 * @param {String} fileName - if defined, only this file will be pushed to remote
 * @param {Object} options - Extra options.
 * @returns {void}
 */
module.exports = async (fileName, options) => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        process.stdout.write('Pushing to remote ...');
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
            process.stdout.write(`Pushing '${metadata.name} > ${fileName}' to remote ...`);
        } else {
            process.stdout.write(`Pushing '${metadata.name}' to remote ...`);
        }

        const downloaded = await downloadRemote(auth, id, projectRoot.folder, 'push');

        if (fileName) {
            if (options.delete) {
                packLocalSingleFile.removeRemoteSingleFile(projectRoot.folder, fileName);
            } else {
                packLocalSingleFile.addLocalSingleFile(projectRoot.folder, fileName);
            }
        } else {
            await pack.local(projectRoot.folder);
        }

        const pushed = await pushToRemote(auth, id, 'local', projectRoot.folder);

        checkbox.display('green');
        process.exit(0);
    } catch (err) {
        checkbox.display('red');
        await error.log(err, auth);
        process.exit(1);
    }
};
