const clone = require('./clone.js');
const authenticate = require('./functions/authenticate.js');
const remoteCreateProject = require('./functions/remoteCreateProject.js');
const handleError = require('./functions/handleError.js');
const printCheckbox = require('./functions/printCheckbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Create a new local and remote Google Apps Script project.
 *
 * @param {string} name - Name of the new Google Apps Script project.
 * @returns {void}
 */
module.exports = (name) => {
    const checkedVersion = checkNewVersion();
    const gotAuth = authenticate([]);

    checkedVersion.then(() => {
        process.stdout.write(`Creating '${name}' in Google Drive...`);
    });

    const createdProject = Promise.all([gotAuth, checkedVersion, ]).then((values) => {
        return remoteCreateProject(values[0], name);
    });

    const finished = createdProject.then((result) => {
        printCheckbox('green');
        clone(result.id, name);
    });

    // Catch all the errors
    Promise.all([gotAuth, createdProject, checkedVersion, finished, ]).catch((err) => {
        handleError(err, true);
        return;
    });
};
