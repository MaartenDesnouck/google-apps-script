var authenticate = require('./functions/authenticate.js');
var unpackRemote = require('./functions/packLocal.js');

module.exports = function(fileId) {
    authenticate([], function(err, oauth2Client) {
        if (err) {
            console.log('The API returned an error: ' + err);
        } else {
            unpackRemote(function() {
                pushToRemote(oauth2Client, fileId, function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(result);
                    }
                });

            });
        }
    });
};
