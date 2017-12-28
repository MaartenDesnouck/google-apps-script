const clone = require('./clone.js');
const authenticate = require('./functions/authenticate.js');
const remoteCreateProject = require('./functions/remoteCreateProject.js');
const error = require('./functions/error.js');
const displayCheckbox = require('./functions/displayCheckbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Create a new local and remote Google Apps Script project.
 *
 * @param {string} projectName - Name of the new Google Apps Script project.
 * @returns {void}
 */
module.exports = async(projectName) => {
    const checkedVersion = await checkNewVersion();
    process.stdout.write(`Creating '${projectName}' in Google Drive...`);

    const auth = await authenticate([]);
    const createdProject = await remoteCreateProject(auth, projectName);

    displayCheckbox('green');
    clone(createdProject.id);
    return;
};
