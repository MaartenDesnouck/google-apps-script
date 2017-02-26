var authenticate = require('./functions/authenticate.js');
var createNewRemote = require('./functions/createNewRemote.js');
var clone = require('./clone.js');

/**
 * Create a new loacl and remote Google Apps Script project.
 *
 * @param {string} name - Name of the new Google Apps Script project.
 * @param {callback} callback
 */
module.exports = function(name, callback) {
    authenticate([], function(err, oauth2Client) {
        if (err) {
            console.log('gas returned an error: ' + err);
        } else {
            createNewRemote(oauth2Client, name, function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Succesfully created new remote project.');
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
