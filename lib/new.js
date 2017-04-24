var authenticate = require('./functions/authenticate.js');
var remoteCreateProject = require('./functions/remoteCreateProject.js');
var clone = require('./clone.js');

/**
 * Create a new local and remote Google Apps Script project.
 *
 * @param {string} name - Name of the new Google Apps Script project.
 */
module.exports = function(name) {
    authenticate([], function(err, oauth2Client) {
        if (err) {
            console.log('gas returned an error: ' + err);
        } else {
            remoteCreateProject(oauth2Client, name, function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Succesfully created the remote project.');
                    clone(result.id, name, function(err) {
                        if (err) {
                            console.log('gas returned an error: ' + err);
                        } else {
                            console.log('Succesfully created new project.');
                        }
                    });
                }
            });
        }
    });
}
