var authenticate = require('./functions/authenticate.js');
var open = require('open');
var getId = require('./functions/getId.js');
var getMetadata = require('./functions/getMetadata.js');

/**
 * Open a local project in the online editor.
 *
 * @param {string} fileId - Id of the project we want to open.
 */
module.exports = function(identifier = null) {
    authenticate([], function(err, oauth2Client) {
        if (err) {
            console.log('gas returned an error: ' + err);
        } else {
            if (identifier === null) {
                getId(function(err, id, dir) {
                    if (err) {
                        console.log('gas returned an error: ' + err);
                    } else {
                        getMetadata(oauth2Client, id, function(err, metadata) {
                            if (err) {
                                console.log('gas returned an error: ' + err);
                            } else {
                                open('https://script.google.com/d/' + metadata.id + '/edit?usp=drive_web');
                            }
                        });
                    }
                });
            } else {
                getMetadata(oauth2Client, identifier, function(err, metadata) {
                    if (err) {
                        console.log('gas returned an error: ' + err);
                    } else {
                        open('https://script.google.com/d/' + metadata.id + '/edit?usp=drive_web');
                    }
                });
            }
        }
    });
};
