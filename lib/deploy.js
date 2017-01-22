var authenticate = require('./functions/authenticate.js');
var getId = require('./functions/getId.js');
var packLocal = require('./functions/packLocal.js');
var pushToRemote = require('./functions/pushToRemote.js');

module.exports = function(fileId) {
    authenticate([], function(err, oauth2Client) {
        if (err) {
            console.log('The API returned an error: ' + err);
        } else {
            getId(function(err, fileId) {
                if (err) {
                    if (err.code == 'ENOENT') {
                        console.log('There appears to be no Google Apps project initiated here. Execute \'gas clone <fileId>\' to start.');
                    } else {
                        console.log('gas returned an error: ' + err);
                    }
                } else {
                    packLocal([], function() {
                        pushToRemote(oauth2Client, fileId, function(err, result) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('Succesfully deployed to Google Drive.');
                            }
                        });
                    });
                }

            });
        }
    });
}
