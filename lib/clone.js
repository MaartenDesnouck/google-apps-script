const path = require('path');
const readline = require('readline');
const authenticate = require('./functions/authenticate.js');
const getMetadata = require('./functions/getMetadata.js');
const downloadRemote = require('./functions/downloadRemote.js');
const unpackRemote = require('./functions/unpackRemote.js');
const displayCheckbox = require('./functions/displayCheckbox.js');
const error = require('./functions/error.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const getProjectRoot = require('./functions/getProjectRoot.js');

/**
 * Clone a remote Google Apps Script project
 *
 * @param {string} identifier - Identifier of the project we want to clone.
 * @returns {void}
 */
module.exports = async(identifier) => {
    try {
        const checkedVersion = await checkNewVersion();
        process.stdout.write('Cloning from Google Drive...');

        const projectRoot = await getProjectRoot('.');
        if (projectRoot.found) {
            displayCheckbox('red');
            process.stdout.write(`You seem to be cloning a project inside another project. Cowardly chose not to do that.`);
        }

        const auth = await authenticate([]);
        const metadata = await getMetadata(auth, identifier);

        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Cloning \'${metadata.name}\' from Google Drive...`);

        const downloaded = await downloadRemote(auth, metadata.id, metadata.name, 'clone');
        const unpacked = await unpackRemote(path.join(process.cwd(), metadata.name), null);

        displayCheckbox('green');
    } catch (err) {
        displayCheckbox('red');
        error.handle(err);
        process.exit(1);
    }
    process.exit(0);
};
