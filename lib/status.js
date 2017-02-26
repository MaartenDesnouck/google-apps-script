var authenticate = require('./functions/authenticate.js');
var downloadRemote = require('./functions/downloadRemote.js')
var getProjectInfo = require('./functions/getProjectInfo.js');
var diff = require('./functions/diff.js');
var packLocal = require('./functions/packLocal.js');

/**
 * Log the difference between the local and remote project files.
 */
module.exports = function() {
    authenticate([], function(err, oauth2Client) {
        if (err) {
            console.log('gas returned an error: ' + err);
        } else {
            getProjectInfo(function(err, fileId, name) {
                if (err) {
                    if (err.code == 'ENOENT') {
                        console.log('There appears to be no project initiated here.');
                        console.log('Navigate to a project folder or execute \'gas new <name>\' or \'gas clone <fileId>\' to initiate a project.');
                    } else {
                        console.log('gas returned an error: ' + err);
                    }
                } else {
                    downloadRemote(oauth2Client, fileId, name, 'pull', function(err) {
                        packLocal(function(err) {
                            if (err) {
                                console.log('gas returned an error: ' + err);
                            } else {
                                //TODO
                            }
                        });
                    });
                }
            });
        }
    });
};
