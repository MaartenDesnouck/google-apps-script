const authenticate = require('./functions/authenticate.js');
const getMetadata = require('./functions/getMetadata.js');
const remoteRenameProject = require('./functions/remoteRenameProject.js');
const error = require('./functions/error.js');
const displayCheckbox = require('./functions/displayCheckbox.js');
const readline = require('readline');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Rename a Google Apps Script project from Google Drive
 *
 * @param {String} identifier - Id of the remote project to rename.
 * @param {String} newProjectName - new name of the project.
 * @returns {void}
 */
module.exports = async(identifier, newProjectName) => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        process.stdout.write(`Renaming project to '${newProjectName}' in your Google Drive...`);
        auth = await authenticate([]);
        const metadata = await getMetadata(auth, identifier);

        process.stdout.clearLine();
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Renaming '${metadata.name}' to '${newProjectName}' in your Google Drive...`);
        const renamed = await remoteRenameProject(auth, metadata.id, metadata.name, newProjectName);

        if (renamed) {
            displayCheckbox('green');
        } else {
            displayCheckbox('yellow');
            process.stdout.write('Skipped renaming because old and new name appear to be the same\n');
        }
        process.exit(0);
    } catch (err) {
        displayCheckbox('red');
        await error.log(err, auth);
        process.exit(1);
    }
};
