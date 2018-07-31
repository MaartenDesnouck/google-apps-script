const clone = require('./clone.js');
const authenticate = require('./functions/authenticate.js');
const remoteCreateProject = require('./functions/remoteCreateProject.js');
const error = require('./functions/error.js');
const checkbox = require('./functions/checkbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Create a new local and remote Google Apps Script project.
 *
 * @param {String} projectName - Name of the new Google Apps Script project.
 * @returns {void}
 */
module.exports = async(projectName) => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        process.stdout.write(`Creating remote '${projectName}' ...`);
        auth = await authenticate([]);
        const createdProject = await remoteCreateProject(auth, projectName);

        checkbox.display('green');
        await clone(createdProject.id);
        process.exit(0);
    } catch (err) {
        checkbox.display('red');
        await error.log(err.auth);
        process.exit(1);
    }
};
