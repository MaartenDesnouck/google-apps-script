var authenticate = require('./functions/authenticate.js');
var getProjectInfo = require('./functions/getProjectInfo.js');
var packLocal = require('./functions/packLocal.js');
var pushToRemote = require('./functions/pushToRemote.js');
var pull = require('./pull.js');

module.exports = function(fileId) {
    authenticate([], function(err, oauth2Client) {
        if (err) {
            console.log('gas returned an error: ' + err);
        } else {
            getProjectInfo(function(err, fileId, name) {
                if (err) {
                    if (err.code == 'ENOENT') {
                        console.log('There appears to be no Google Apps project initiated here. Execute \'gas new <name>\' or \'gas clone <fileId>\' to start.');
                    } else {
                        console.log('gas returned an error: ' + err);
                    }
                } else {
                    packLocal(function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            pushToRemote(oauth2Client, fileId, function(err, result) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('Succesfully deployed local verion to Google Drive.');
                                    pull(false);
                                }
                            });
                        }
                    });
                }

            });
        }
    });
}
