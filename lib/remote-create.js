const colors = require('colors');
const authenticate = require('./functions/authenticate.js');
const remoteCreateProject = require('./functions/remoteCreateProject.js');
const handleError = require('./functions/handleError.js');

/**
 * Create a new remote Google Apps Script project in your Google Drive.
 *
 * @param {string} name - Name of the new Google Apps Script project.
 */
module.exports = function(name) {
    process.stdout.write('Creating \'' + name + '\' in your Google Drive...');
    authenticate([], function(err, auth) {
        if (err) {
            process.stdout.write(' [' + '✘'.red + ']\n');
            handleError(auth, err);
        } else {
            remoteCreateProject(auth, name, function(err, result) {
                if (err) {
                    process.stdout.write(' [' + '✘'.red + ']\n');
                    handleError(auth, err);
                } else {
                    process.stdout.write(' [' + '✔'.green + ']\n');
                    console.log('[' + result.id + '] ' + result.name);
                }
            });
        }
    });
}
