var authenticate = require('./functions/authenticate.js');

/**
 * Open a local project in the online editor.
 *
 * @param {string} fileId - Id of the project we want to clone.
 */
module.exports = function(nameFilter) {
    authenticate([], function(err, oauth2Client) {
        if (err) {
            console.log('gas returned an error: ' + err);
        } else {
            console.log('This function has not been implemented yet');
            //TODO
        }
    });
};
