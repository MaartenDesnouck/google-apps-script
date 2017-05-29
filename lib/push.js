var authenticate = require('./functions/authenticate.js');
var getId = require('./functions/getId.js');
var packLocal = require('./functions/packLocal.js');
var pushToRemote = require('./functions/pushToRemote.js');
var downloadRemote = require('./functions/downloadRemote.js');
var getMetadata = require('./functions/getMetadata.js');
var handleError = require('./functions/handleError.js');
var pull = require('./pull.js');
var colors = require('colors');

/**
 * Push all local code to the remote Google Apps Script project
 */
module.exports = function() {
    process.stdout.write('Pushing code to Google Drive...');
    authenticate([], function(err, oauth2Client) {
        if (err) {
            process.stdout.write(' [' + '✘'.red + ']\n');
            handleError(err);
        } else {
            getId(function(err, fileId, name) {
                if (err) {
                    process.stdout.write(' [' + '✘'.red + ']\n');
                    handleError(err);
                } else {
                    getMetadata(oauth2Client, fileId, function(err, metadata) {
                        if (err) {
                            process.stdout.write(' [' + '✘'.red + ']\n');
                            handleError(err);
                        } else {
                            downloadRemote(oauth2Client, fileId, null, 'pull', function(err) {
                                if (err) {
                                    process.stdout.write(' [' + '✘'.red + ']\n');
                                    handleError(err);
                                } else {
                                    packLocal(function(err) {
                                        if (err) {
                                            process.stdout.write(' [' + '✘'.red + ']\n');
                                            handleError(err);
                                        } else {
                                            pushToRemote(oauth2Client, fileId, function(err, result) {
                                                if (err) {
                                                    process.stdout.write(' [' + '✘'.red + ']\n');
                                                    handleError(err);
                                                } else {
                                                    process.stdout.write(' [' + '✔'.green + ']\n');
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}
