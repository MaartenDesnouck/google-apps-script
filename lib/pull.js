var authenticate = require('./functions/authenticate.js');
var downloadRemote = require('./functions/downloadRemote.js')
var unpackRemote = require('./functions/unpackRemote.js');
var getId = require('./functions/getId.js');
var handleError = require('./functions/handleError.js');
var include = require('./include.js');

/**
 * Pull code from a linked remote Google Apps Script project
 *
 * @param {booblean} log - If we want to log a success message or not.
 */
module.exports = function(options, log) {
    if (log === undefined) {
        log = true;
    }
    authenticate([], function(err, oauth2Client) {
        if (err) {
            handleError(err);
        } else {
            getId(function(err, fileId, dir) {
                if (err) {
                    handleError(err);
                } else {
                    downloadRemote(oauth2Client, fileId, dir, 'pull', function(err) {
                        if (err) {
                            handleError(err);
                        } else {
                            unpackRemote(dir, function(err) {
                                if (err) {
                                    handleError(err);
                                } else {
                                    if (log) {
                                        console.log('Succesfully pulled from Google Drive.');
                                        if (options.include) {
                                            include();
                                        }
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
