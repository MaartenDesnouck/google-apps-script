var authenticate = require('./functions/authenticate.js');
var downloadRemote = require('./functions/downloadRemote.js')
var unpackRemote = require('./functions/unpackRemote.js');
var getId = require('./functions/getId.js');

module.exports = function() {
    authenticate([], function(err, oauth2Client) {
        if (err) {
            console.log('The API returned an error: ' + err);
        } else {
            getId(function(err, fileId) {
                if (err) {
                    if (err.code == 'ENOENT') {
                        console.log('There appears to be no Google Apps project initiated here. First do \'clone <fileId>\'');
                    } else {
                        console.log('gaps returned an error: ' + err);
                    }
                } else {
                    downloadRemote(oauth2Client, fileId, 'pull', function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            unpackRemote(function() {});
                        }
                    });
                }
            });
        }
    });
};
