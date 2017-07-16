const authenticate = require('./functions/authenticate.js');
const remoteCreateProject = require('./functions/remoteCreateProject.js');
const handleError = require('./functions/handleError.js');
const printCheckbox = require('./functions/printCheckbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Create a new remote Google Apps Script project in your Google Drive.
 *
 * @param {string} name - Name of the new Google Apps Script project.
 * @returns {void}
 */
module.exports = (name) => {
    process.stdout.write(`Creating \'${name}\' in your Google Drive...`);
    var checkedVersion = checkNewVersion();
    var gotAuth = authenticate([]);

    var createdProject = Promise.all([gotAuth, checkedVersion]).then(values => {
        return remoteCreateProject(values[0], name);
    });

    createdProject.then(result => {
        printCheckbox('green');
        console.log(`[ ${result.id} ] ${result.name}`);
    });

    // Catch all the errors
    Promise.all([gotAuth, createdProject, checkedVersion]).catch(err => {
        if (value[0]) {
            handleError(value[0], err, false);
        } else {
            handleError(null, err, false);
        }
    });
};
