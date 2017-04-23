var authenticate = require('./functions/authenticate.js');
var createNewRemote = require('./functions/createNewRemote.js');
var clone = require('./clone.js');

/**
 * Create a new remote Google Apps Script project.
 *
 * @param {string} name - Name of the new Google Apps Script project.
 */
module.exports = function(name) {
    authenticate([], function(err, oauth2Client) {
        if (err) {
            console.log('gas returned an error: ' + err);
        } else {
            createNewRemote(oauth2Client, name, function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Succesfully created new project in your Google Drive:');
                    console.log('[' + result.id + '] ' + result.name);
                }
            });
        }
    });
}
