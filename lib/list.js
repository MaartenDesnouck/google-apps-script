var authenticate = require('./functions/authenticate.js');
var listScriptFiles = require('./functions/listScriptFiles.js');

module.exports = function(nameContains) {
    authenticate([], function(err, oauth2Client) {
      if (err) {
          console.log('The API returned an error: ' + err);
      } else {
          listScriptFiles(oauth2Client, nameContains, null);
      }
    });
};
