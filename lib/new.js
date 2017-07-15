const clone = require('./clone.js');
const authenticate = require('./functions/authenticate.js');
const remoteCreateProject = require('./functions/remoteCreateProject.js');
const handleError = require('./functions/handleError.js');
const printCheckbox = require('./functions/printCheckbox.js');

/**
 * Create a new local and remote Google Apps Script project.
 *
 * @param {string} name - Name of the new Google Apps Script project.
 * @returns {void}
 */
module.exports = (name) => {
    process.stdout.write('Creating \'' + name + '\' in Google Drive...');
    checkNewVersion().then(() => {
        return authenticate(options);
    }).then(auth => {
        return remoteCreateProject(auth, name);
    }).then(result => {
        return clone(result.id, name);
    }).then(info => {
        printCheckbox('green');
    }).catch(err => {
        handleError(auth, err, false);
    });
};
