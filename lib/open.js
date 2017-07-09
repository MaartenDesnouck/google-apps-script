const openWebpage = require('open');
const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const getMetadata = require('./functions/getMetadata.js');
const handleError = require('./functions/handleError.js');

/**
 * Open a local project in the online editor.
 *
 * @param {string} fileId - Id of the project we want to open.
 * @returns {void}
 */
module.exports = (identifier) => {
    authenticate([], (err, auth) => {
        if (err) {
            handleError(auth, err);
        } else {
            if (identifier === undefined) {
                getId((err, id, dir) => {
                    if (err) {
                        handleError(auth, err);
                    } else {
                        getMetadata(auth, id, (err, metadata) => {
                            if (err) {
                                handleError(auth, err);
                            } else {
                                openWebpage('https://script.google.com/d/' + metadata.id + '/edit?usp=drive_web');
                            }
                        });
                    }
                });
            } else {
                getMetadata(auth, identifier, (err, metadata) => {
                    if (err) {
                        handleError(auth, err);
                    } else {
                        openWebpage('https://script.google.com/d/' + metadata.id + '/edit?usp=drive_web');
                    }
                });
            }
        }
    });
};
