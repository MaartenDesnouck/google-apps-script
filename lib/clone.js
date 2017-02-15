var authenticate = require('./functions/authenticate.js');
var downloadRemote = require('./functions/downloadRemote.js')
var unpackRemote = require('./functions/unpackRemote.js');

module.exports = function(fileId) {
    authenticate([], function(err, oauth2Client) {
        if (err) {
            console.log('The API returned an error: ' + err);
        } else {
          downloadRemote(oauth2Client, fileId, 'clone', function(err) {
              if (err) {
                  console.log('gas returned an error: ' + err);
              } else {
                  unpackRemote(null, function() {
                      console.log('Succesfully cloned from Google Drive.');
                  });
              }
          });
        }
    });
};
