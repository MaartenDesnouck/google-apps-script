const readline = require('readline');
const include = require('./include.js');
const authenticate = require('./functions/authenticate.js');
const downloadRemote = require('./functions/downloadRemote.js');
const unpackRemote = require('./functions/unpackRemote.js');
const getMetadata = require('./functions/getMetadata.js');
const getId = require('./functions/getId.js');
const error = require('./functions/error.js');
const displayCheckbox = require('./functions/displayCheckbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const getProjectRoot = require('./functions/getProjectRoot.js');

/**
 * Pull code from a linked remote Google Apps Script project
 *
 * @param {object} fileName - Optional fileName to pull.
 * @param {object} options - Extra options.
 * @returns {void}
 */
module.exports = async(fileName, options) => {
    const checkedVersion = await checkNewVersion();
    const projectRoot = await getProjectRoot('.');

    process.stdout.write('Pulling from Google Drive...');

    const auth = await authenticate([]);

    let id;
    if (projectRoot.found) {
        id = await getId(projectRoot.folder);
    } else {
        displayCheckbox('red');
        process.stdout.write(`Can't seem to find a Google Apps Script project here.`);
        return;
    }

    const metadata = await getMetadata(auth, id);

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
        include();
    }
    return;
};
