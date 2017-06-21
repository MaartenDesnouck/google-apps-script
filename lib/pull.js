const colors = require('colors');
const readline = require('readline');
const include = require('./include.js');
const authenticate = require('./functions/authenticate.js');
const downloadRemote = require('./functions/downloadRemote.js')
const unpackRemote = require('./functions/unpackRemote.js');
const getMetadata = require('./functions/getMetadata.js');
const getId = require('./functions/getId.js');
const handleError = require('./functions/handleError.js');

/**
 * Pull code from a linked remote Google Apps Script project
 *
 * @param {object} options - Extra options.
 */
module.exports = function(options) {
    process.stdout.write('Pulling from Google Drive...');
    authenticate([], function(err, oauth2Client) {
        if (err) {
            process.stdout.write(' [' + '✘'.red + ']\n');
            handleError(err);
        } else {
            getId(function(err, fileId, dir) {
                if (err) {
                    process.stdout.write(' [' + '✘'.red + ']\n');
                    handleError(err);
                } else {
                    getMetadata(oauth2Client, fileId, function(err, metadata) {
                        if (err) {
                            process.stdout.write(' [' + '✘'.red + ']\n');
                            handleError(err);
                        } else {
                            process.stdout.clearLine();
                            readline.cursorTo(process.stdout, 0);
                            process.stdout.write('Pulling \'' + metadata.name + '\' from Google Drive...');
                            downloadRemote(oauth2Client, fileId, dir, 'pull', function(err) {
                                if (err) {
                                    process.stdout.write(' [' + '✘'.red + ']\n');
                                    handleError(err);
                                } else {
                                    unpackRemote(dir, function(err) {
                                        if (err) {
                                            process.stdout.write(' [' + '✘'.red + ']\n');
                                            handleError(err);
                                        } else {
                                            process.stdout.write(' [' + '✔'.green + ']\n');
                                            if (options.include) {
                                                include();
                                            }
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
};
