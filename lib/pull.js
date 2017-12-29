const readline = require('readline');
const include = require('./include.js');
const constants = require('./constants.js');
const authenticate = require('./functions/authenticate.js');
const downloadRemote = require('./functions/downloadRemote.js');
const unpackRemote = require('./functions/unpackRemote.js');
const getMetadata = require('./functions/getMetadata.js');
const getId = require('./functions/getId.js');
const error = require('./functions/error.js');
const displayCheckbox = require('./functions/displayCheckbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const findInProject = require('./functions/findInProject.js');

/**
 * Pull code from a linked remote Google Apps Script project
 *
 * @param {object} fileName - Optional fileName to pull.
 * @param {object} options - Extra options.
 * @returns {void}
 */
module.exports = async(fileName, options) => {
    try {
        const checkedVersion = await checkNewVersion();
        process.stdout.write('Pulling from Google Drive...');
        const projectRoot = await findInProject('.', constants.META_DIR);

        if (!projectRoot.found) {
            throw {
                message: `Can't seem to find a Google Apps Script project here.`,
                print: true,
            }
        }

        const id = await getId(projectRoot.folder);
        const auth = await authenticate([]);
        const metadata = await getMetadata(auth, id);

        if (!metadata) {
            throw {
                message: 'No metadata found in pull.js',
                print: false,
            };
        }

        readline.cursorTo(process.stdout, 0);
        if (fileName) {
            process.stdout.write(`Pulling \'${metadata.name} > ${fileName}\' from Google Drive...`);
        } else {
            process.stdout.write(`Pulling \'${metadata.name}\' from Google Drive...`);
        }

        const downloaded = await downloadRemote(auth, id, projectRoot.folder, 'pull');
        const unpacked = await unpackRemote(projectRoot.folder, fileName);

        displayCheckbox('green');
        if (options.include) {
            await include();
        }
        process.exit(0);

    } catch (err) {
        displayCheckbox('red');
        await error.log(err);
        process.exit(1);
    }
};
