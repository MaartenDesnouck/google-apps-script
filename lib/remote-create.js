var authenticate = require('./functions/authenticate.js');
var remoteCreateProject = require('./functions/remoteCreateProject.js');
var handleError = require('./functions/handleError.js');
var colors = require('colors');

/**
 * Create a new remote Google Apps Script project in your Google Drive.
 *
 * @param {string} name - Name of the new Google Apps Script project.
 */
module.exports = function(name) {
    process.stdout.write('Creating \'' + name + '\' in Google Drive...');
    authenticate([], function(err, oauth2Client) {
        if (err) {
            process.stdout.write(' [' + '✘'.red + ']\n');
            handleError(err);
        } else {
            remoteCreateProject(oauth2Client, name, function(err, result) {
                if (err) {
                    process.stdout.write(' [' + '✘'.red + ']\n');
                    handleError(err);
                } else {
                    process.stdout.write(' [' + '✔'.green + ']\n');
                    console.log('[' + result.id + '] ' + result.name);
                }
            });
        }
    });
}
