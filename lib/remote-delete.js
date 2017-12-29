const authenticate = require('./functions/authenticate.js');
const getMetadata = require('./functions/getMetadata.js');
const remoteDeleteProject = require('./functions/remoteDeleteProject.js');
const error = require('./functions/error.js');
const checkbox = require('./functions/checkbox.js');
const readline = require('readline');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Delete a Google Apps Script project from your Google Drive
 *
 * @param {String} identifier - Identifier of the remote project to link to the current folder.
 * @returns {void}
 */
module.exports = async(identifier) => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        process.stdout.write(`Deleting '${identifier}' from your Google Drive...`);

        auth = await authenticate([]);
        const metadata = await getMetadata(auth, identifier);

        readline.clearLine(process.stdout);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Deleting '${metadata.name}' from your Google Drive...`);
        const deleted = await remoteDeleteProject(auth, metadata.id, metadata.name);

        checkbox.display('green');
        process.exit(0);
    } catch (err) {
        checkbox.display('red');
        await error.log(err, auth);
        process.exit(1);
    }
};
