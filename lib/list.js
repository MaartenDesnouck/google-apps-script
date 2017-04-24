var authenticate = require('./functions/authenticate.js');
var listScriptFiles = require('./functions/listScriptFiles.js');

/**
 * List all remote Google Apps Script projects matching an optional name filter.
 *
 * @param {string} nameFilter - Id of the project we want to clone.
 */
module.exports = function(nameFilter) {
    authenticate([], function(err, oauth2Client) {
        if (err) {
            console.log('gas returned an error: ' + err);
        } else {
            listScriptFiles(oauth2Client, nameFilter);
        }
    });
};
