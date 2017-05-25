var authenticate = require('./functions/authenticate.js');
var downloadRemote = require('./functions/downloadRemote.js');
var unpackRemote = require('./functions/unpackRemote.js');
var getMetadata = require('./functions/getMetadata.js');
var handleError = require('./functions/handleError.js');
var constants = require('./constants.js');
var fs = require('fs');

/**
 * Clone a remote Google Apps Script project
 *
 * @param {string} fileId - Id of the project we want to clone.
 */
module.exports = function(identifier) {
    console.log('Cloning project from Google Drive...');
    authenticate([], function(err, oauth2Client) {
        if (err) {
            handleError(err);
        } else {
            getMetadata(oauth2Client, identifier, function(err, metadata) {
                if (err) {
                    handleError(err);
                } else {
                    downloadRemote(oauth2Client, metadata.id, metadata.name, 'clone', function(err) {
                        if (err) {
                            handleError(err);
                        } else {
                            unpackRemote(metadata.name, function(err) {
                                if (err) {
                                    handleError(err);
                                } else {
                                    console.log('Succesfully cloned from Google Drive.');
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};
