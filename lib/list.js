var authenticate = require('./functions/authenticate.js');
var listScriptFiles = require('./functions/listScriptFiles.js');

module.exports = function(nameFilter) {
    authenticate([], function(err, oauth2Client) {
      if (err) {
          console.log('gas returned an error: ' + err);
      } else {
          listScriptFiles(oauth2Client, nameFilter);
      }
    });
};
