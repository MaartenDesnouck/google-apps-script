const authenticate = require('./functions/authenticate.js');
const getMetadata = require('./functions/getMetadata.js');
const remoteDeleteProject = require('./functions/remoteDeleteProject.js');
const handleError = require('./functions/handleError.js');
const displayCheckbox = require('./functions/displayCheckbox.js');
const readline = require('readline');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Delete a Google Apps Script project from your Google Drive
 *
 * @param {string} identifier - Identifier of the remote project to link to the current folder.
 * @returns {void}
 */
module.exports = async(identifier) => {
    const checkedVersion = await checkNewVersion();
    process.stdout.write(`Deleting \'${identifier}\' from your Google Drive...`);

    const auth = await authenticate([]);
    const metadata = await getMetadata(auth, identifier);

    process.stdout.write(`Deleting \'${metadata.name}\' from your Google Drive...`);
    const deleted = await remoteDeleteProject(auth, metadata.id, metadata.name);

    displayCheckbox('green');
    return;
};
