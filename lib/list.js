var authenticate = require('./functions/authenticate.js');
var listAllScriptFiles = require('./functions/listAllScriptFiles.js');

module.exports = function() {
    authenticate([], function(err, oauth2Client) {
      if (err) {
          console.log('The API returned an error: ' + err);
      } else {
          listAllScriptFiles(oauth2Client, null);
      }
    });
};
