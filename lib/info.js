var authenticate = require('./functions/authenticate.js');
var open = require('open');
var getId = require('./functions/getId.js');
var getMetadata = require('./functions/getMetadata.js');
var handleError = require('./functions/handleError.js');

/**
 * Display info about a google apps script project
 *
 * @param {string} fileId - Id of the project we want info about.
 */
module.exports = function(identifier) {
    authenticate([], function(err, oauth2Client) {
        if (err) {
            handleError(err);
        } else {
            if (identifier === undefined) {
                getId(function(err, id, dir) {
                    if (err) {
                        handleError(err);
                    } else {
                        getMetadata(oauth2Client, id, function(err, metadata) {
                            if (err) {
                                handleError(err);
                            } else {
                                console.log("   name:           " + metadata.name);
                                console.log("   id:             " + metadata.id);
                                console.log("   description:    " + metadata.description);
                                console.log("   createdAt:      " + metadata.createdTime);
                                console.log("   lastModifiedAt: " + metadata.modifiedTime);
                            }
                        });
                    }
                });
            } else {
                getMetadata(oauth2Client, identifier, function(err, metadata) {
                    if (err) {
                        handleError(err);
                    } else {
                        console.log("   name:           " + metadata.name);
                        console.log("   id:             " + metadata.id);
                        console.log("   description:    " + metadata.description);
                        console.log("   createdAt:      " + metadata.createdTime);
                        console.log("   lastModifiedAt: " + metadata.modifiedTime);
                    }
                });
            }
        }
    });
};
