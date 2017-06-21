const colors = require('colors');
const pull = require('./pull.js');
const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const packLocal = require('./functions/packLocal.js');
const pushToRemote = require('./functions/pushToRemote.js');
const downloadRemote = require('./functions/downloadRemote.js');
const getMetadata = require('./functions/getMetadata.js');
const handleError = require('./functions/handleError.js');

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
