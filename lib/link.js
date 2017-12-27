const readline = require('readline');
const authenticate = require('./functions/authenticate.js');
const getMetadata = require('./functions/getMetadata.js');
const downloadRemote = require('./functions/downloadRemote.js');
const handleError = require('./functions/handleError.js');
const displayCheckbox = require('./functions/displayCheckbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const getProjectRoot = require('./functions/getProjectRoot.js');

/**
 * Link a remote Google Apps Script project to the current folder
 *
 * @param {string} identifier - Identifier of the remote project to link to the current folder.
 * @returns {void}
 */
module.exports = async(identifier) => {
    const checkedVersion = await checkNewVersion();
    process.stdout.write('Linking to this folder...');
    const projectRoot = await getProjectRoot('.');

    if (projectRoot.found && projectRoot.folder !== '.') {
        displayCheckbox('red');
        process.stdout.write(`You seem to be linking a project inside another project. Cowardly chose not to do that.`);
        process.stdout.write(`If you are sure you are not in another project you can execute 'gas unlink' to unlink the remote project.`);
        return;
    }

    const auth = await authenticate([]);
    const metadata = await getMetadata(auth, identifier);

    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`Linking '${metadata.name}' to this folder...`);
    const downloaded = await downloadRemote(auth, metadata.id, '.', 'link');

    displayCheckbox('green');
    return;
};
