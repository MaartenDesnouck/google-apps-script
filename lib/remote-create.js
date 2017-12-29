const authenticate = require('./functions/authenticate.js');
const remoteCreateProject = require('./functions/remoteCreateProject.js');
const error = require('./functions/error.js');
const displayCheckbox = require('./functions/displayCheckbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Create a new remote Google Apps Script project in your Google Drive.
 *
 * @param {String} projectName - Name of the new Google Apps Script project.
 * @returns {void}
 */
module.exports = async(projectName) => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        process.stdout.write(`Creating '${projectName}' in your Google Drive...`);
        auth = await authenticate([]);
        const createdProject = await remoteCreateProject(auth, projectName);

        displayCheckbox('green');
        console.log(`[${createdProject.id}] ${createdProject.name}`);
        process.exit(0);
    } catch (err) {
        displayCheckbox('red');
        await error.log(err, auth);
        process.exit(1);
    }
};
