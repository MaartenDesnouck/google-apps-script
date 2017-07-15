const authenticate = require('./functions/authenticate.js');
const remoteCreateProject = require('./functions/remoteCreateProject.js');
const handleError = require('./functions/handleError.js');
const printCheckbox = require('./functions/printCheckbox.js');

/**
 * Create a new remote Google Apps Script project in your Google Drive.
 *
 * @param {string} name - Name of the new Google Apps Script project.
 * @returns {void}
 */
module.exports = (name) => {
    process.stdout.write(`Creating \'${name}\' in your Google Drive...`);
    checkNewVersion().then(() => {
        return authenticate(options);
    }).then(auth => {
        return remoteCreateProject(auth, name);
    }).then(result => {
        printCheckbox('green');
        console.log(`[ ${result.id} ] ${result.name}`);
    }).catch(err => {
        handleError(auth, err, false);
    });
};
