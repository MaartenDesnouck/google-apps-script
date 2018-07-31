const authenticate = require('./functions/authenticate.js');
const getMetadata = require('./functions/getMetadata.js');
const remoteRenameProject = require('./functions/remoteRenameProject.js');
const error = require('./functions/error.js');
const checkbox = require('./functions/checkbox.js');
const readline = require('readline');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Rename a remote Google Apps Script project
 *
 * @param {String} identifier - Id of the remote project to rename.
 * @param {String} newProjectName - new name of the project.
 * @returns {void}
 */
module.exports = async (identifier, newProjectName) => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        process.stdout.write(`Renaming remote '${identifier}' to '${newProjectName}' ...`);
        auth = await authenticate([]);
        const metadata = await getMetadata(auth, identifier);

        readline.clearLine(process.stdout);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Renaming remote '${metadata.name}' to '${newProjectName}' ...`);
        const renamed = await remoteRenameProject(auth, metadata.projectId, metadata.name, newProjectName);

        if (renamed) {
            checkbox.display('green');
        } else {
            checkbox.display('yellow');
            process.stdout.write('Skipped renaming because old and new name appear to be the same\n');
        }
        process.exit(0);
    } catch (err) {
        checkbox.display('red');
        await error.log(err, auth);
        process.exit(1);
    }
};
