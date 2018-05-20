const authenticate = require('./functions/authenticate.js');
const remoteCreateProject = require('./functions/remoteCreateProject.js');
const error = require('./functions/error.js');
const checkbox = require('./functions/checkbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const columnify = require('columnify');

/**
 * Create a new remote Google Apps Script project in your Google Drive.
 *
 * @param {String} projectTitle - Name of the new Google Apps Script project.
 * @returns {void}
 */
module.exports = async (projectTitle) => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        process.stdout.write(`Creating '${projectTitle}' in Google Drive...`);
        auth = await authenticate([]);
        const createdProject = await remoteCreateProject(auth, projectTitle);

        checkbox.display('green');

        console.log(
            columnify([createdProject], {
                columns: ['id', 'name',]
            })
        );

        process.exit(0);
    } catch (err) {
        checkbox.display('red');
        await error.log(err, auth);
        process.exit(1);
    }
};
