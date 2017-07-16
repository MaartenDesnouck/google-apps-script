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
    process.stdout.write(`Creating '${name}' in Google Drive...`);
    const checkedVersion = checkNewVersion();
    const gotAuth = authenticate([]);

    const createdProject = Promise.all([gotAuth, checkedVersion, ]).then((values) => {
        return remoteCreateProject(values[0], name);
    });

    createdProject.then((result) => {
        printCheckbox('green');
        clone(result.id, name);
    });

    // Catch all the errors
    gotAuth.then((auth) => {
        Promise.all([createdProject, checkedVersion, ]).catch((err) => {
            handleError(auth, err, false);
            return;
        });
    }).catch((err) => {
        handleError(null, err, false);
        return;
    });
};
