var authenticate = require('./functions/authenticate.js');
var remoteCreateProject = require('./functions/remoteCreateProject.js');
var handleError = require('./functions/handleError.js');
var clone = require('./clone.js');

/**
 * Create a new local and remote Google Apps Script project.
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
                    console.log('Succesfully created the remote project.');
                    clone(result.id, name, function(err) {
                        if (err) {
                            handleError(err);
                        } else {
                            console.log('Succesfully created new project.');
                        }
                    });
                }
            });
        }
    });
}
