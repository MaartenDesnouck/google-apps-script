var authenticate = require('./functions/authenticate.js');
var listScriptFiles = require('./functions/listScriptFiles.js');

/**
 * List all remote Google Apps Script projects matching an optional name filter.
 *
 * @param {string} nameFilter - Filter to filter projects on.
 */
module.exports = function(nameFilter) {
    authenticate([], function(err, oauth2Client) {
        if (err) {
            console.log('gas returned an error: ' + err);
        } else {
            listScriptFiles(oauth2Client, nameFilter, true, null, function(err, files){
              if (err) {
                  console.log('gas returned an error: ' + err);
              }
            });
        }
    });
};
