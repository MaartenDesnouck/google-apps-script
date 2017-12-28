const readline = require('readline');
const pull = require('./pull.js');
const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const packLocal = require('./functions/packLocal.js');
const packLocalSingleFile = require('./functions/packLocalSingleFile.js');
const pushToRemote = require('./functions/pushToRemote.js');
const downloadRemote = require('./functions/downloadRemote.js');
const getMetadata = require('./functions/getMetadata.js');
const error = require('./functions/error.js');
const displayCheckbox = require('./functions/displayCheckbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const getProjectRoot = require('./functions/getProjectRoot.js');

/**
 * Push all local code to the remote Google Apps Script project
 *
 * @param {string} fileName - if defined, only this file will be pushed to remote
 * @param {object} options - Extra options.
 * @returns {void}
 */
module.exports = async(fileName, options) => {
    try {
        const checkedVersion = await checkNewVersion();
        process.stdout.write('Pushing code to Google Drive...');
        const projectRoot = await getProjectRoot('.');

        if (!projectRoot.found) {
            displayCheckbox('red');
            process.stdout.write(`Can't seem to find a Google Apps Script project here.\n`);
            process.exit(1);
        }

        const id = await getId(projectRoot.folder);
        const auth = await authenticate([]);
        const metadata = await getMetadata(auth, id);

        if (metadata) {
            readline.cursorTo(process.stdout, 0);
            if (fileName) {
                process.stdout.write(`Pushing \'${metadata.name} > ${fileName}\' to Google Drive...`);
            } else {
                process.stdout.write(`Pushing \'${metadata.name}\' to Google Drive...`);
            }

            const downloaded = await downloadRemote(auth, id, projectRoot.folder, 'push');

            if (fileName) {
                if (options.delete) {
                    await packLocalSingleFile.removeRemoteSingleFile(projectRoot.folder, fileName);
                } else {
                    await packLocalSingleFile.addLocalSingleFile(projectRoot.folder, fileName);
                }
            } else {
                await packLocal(projectRoot.folder);
            }

            const pushed = await pushToRemote(auth, id, 'local', projectRoot.folder);

            displayCheckbox('green');
            process.exit(0);
        } else {
            // TODO handle this
            displayCheckbox('red');
            process.exit(1);
        }
    } catch (err) {
        displayCheckbox('red');
        error.handle(err);
        process.exit(1);
    }
};
