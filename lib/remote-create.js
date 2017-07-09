const colors = require('colors');
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
    authenticate([], (err, auth) => {
        if (err) {
            handleError(auth, err, true);
        } else {
            remoteCreateProject(auth, name, (err, result) => {
                if (err) {
                    handleError(auth, err, true);
                } else {
                    printCheckbox('green');
                    console.log('[' + result.id + '] ' + result.name);
                }
            });
        }
    });
};
