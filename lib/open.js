const open = require('open');
const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const getMetadata = require('./functions/getMetadata.js');
const handleError = require('./functions/handleError.js');

/**
 * Open a local project in the online editor.
 *
 * @param {string} fileId - Id of the project we want to open.
 */
module.exports = function(identifier) {
    authenticate([], function(err, auth) {
        if (err) {
            handleError(auth, err);
        } else {
            if (identifier === undefined) {
                getId(function(err, id, dir) {
                    if (err) {
                        handleError(auth, err);
                    } else {
                        getMetadata(auth, id, function(err, metadata) {
                            if (err) {
                                handleError(auth, err);
                            } else {
                                open('https://script.google.com/d/' + metadata.id + '/edit?usp=drive_web');
                            }
                        });
                    }
                });
            } else {
                getMetadata(auth, identifier, function(err, metadata) {
                    if (err) {
                        handleError(auth, err);
                    } else {
                        open('https://script.google.com/d/' + metadata.id + '/edit?usp=drive_web');
                    }
                });
            }
        }
    });
};
