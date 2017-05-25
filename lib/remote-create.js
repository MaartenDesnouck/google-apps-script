var authenticate = require('./functions/authenticate.js');
var remoteCreateProject = require('./functions/remoteCreateProject.js');
var handleError = require('./functions/handleError.js');

/**
 * Create a new remote Google Apps Script project in your Google Drive.
 *
 * @param {string} name - Name of the new Google Apps Script project.
 */
module.exports = function(name) {
    authenticate([], function(err, oauth2Client) {
        if (err) {
            handleError(err);
        } else {
            remoteCreateProject(oauth2Client, name, function(err, result) {
                if (err) {
                    handleError(err);
                } else {
                    console.log('Succesfully created new project in your Google Drive:');
                    console.log('[' + result.id + '] ' + result.name);
                }
            });
        }
    });
}
