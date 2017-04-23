var authenticate = require('./functions/authenticate.js');
var downloadRemote = require('./functions/downloadRemote.js')
var unpackRemote = require('./functions/unpackRemote.js');
var getId = require('./functions/getId.js');

/**
 * List all remote Google Apps Script projects matching an optional name filter.
 *
 * @param {booblean} log - If we want to log a success message or not.
 */
module.exports = function(log = true) {
    authenticate([], function(err, oauth2Client) {
        if (err) {
            console.log('gas returned an error: ' + err);
        } else {
            getId(function(err, fileId, dir) {
                if (err) {
                    if (err.code == 'ENOENT') {
                        console.log('There appears to be no project initiated here.');
                        console.log('Navigate to a project folder or execute \'gas new <name>\' or \'gas clone <fileId>\' to initiate a project.');
                    } else {
                        console.log('gas returned an error: ' + err);
                    }
                } else {
                    downloadRemote(oauth2Client, fileId, dir, 'pull', function(err) {
                        if (err) {
                            console.log('gas returned an error: ' + err);
                        } else {
                            unpackRemote(dir, function(err) {
                                if (err) {
                                    console.log('gas returned an error: ' + err);
                                } else {
                                    if (log) {
                                        console.log('Succesfully pulled from Google Drive.');
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};
