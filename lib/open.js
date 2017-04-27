var authenticate = require('./functions/authenticate.js');
var open = require('open');
var getId = require('./functions/getId.js');
var getMetadata = require('./functions/getMetadata.js');

/**
 * Open a local project in the online editor.
 *
 * @param {string} fileId - Id of the project we want to clone.
 */
module.exports = function(fileId = null) {
    authenticate([], function(err, oauth2Client) {
        if (err) {
            console.log('gas returned an error: ' + err);
        } else {
            if (fileId === null) {
                getId(function(err, fileId, dir) {
                    if (err) {
                        if (err.code == 'ENOENT') {
                            console.log('There appears to be no project initiated here.');
                            console.log('Navigate to a project folder or execute \'gas new <name>\', \'gas clone <fileId>\' or \'gas link <fileId>\' to get started.');
                        } else {
                            console.log('gas returned an error: ' + err);
                        }
                    } else {
                        getMetadata(oauth2Client, fileId, function(err, kind, id, name, mimeType) {
                            if (err) {
                                console.log('gas returned an error: ' + err);
                            } else {
                                open('https://script.google.com/d/' + fileId + '/edit?usp=drive_web');
                            }
                        });
                    }
                });
            } else {
                getMetadata(oauth2Client, fileId, function(err, kind, id, name, mimeType) {
                    if (err) {
                        console.log('gas returned an error: ' + err);
                    } else {
                        open('https://script.google.com/d/' + fileId + '/edit?usp=drive_web');
                    }
                });
            }
        }
    });
};
