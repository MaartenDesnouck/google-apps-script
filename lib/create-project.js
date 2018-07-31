const authenticate = require('./functions/authenticate.js');
const remoteCreateProject = require('./functions/remoteCreateProject.js');
const error = require('./functions/error.js');
const checkbox = require('./functions/checkbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const columnify = require('columnify');

/**
 * Create a new remote Google Apps Script project.
 *
 * @param {String} projectName - Name of the new Google Apps Script project.
 * @returns {void}
 */
module.exports = async (projectName) => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        process.stdout.write(`Creating remote script project '${projectName}' ...`);
        auth = await authenticate([]);
        const createdProject = await remoteCreateProject(auth, projectName);

        checkbox.display('green');

        console.log(
            columnify([createdProject, ], {
                columns: ['id', 'name', ],
            })
        );

        process.exit(0);
    } catch (err) {
        checkbox.display('red');
        await error.log(err, auth);
        process.exit(1);
    }
};
