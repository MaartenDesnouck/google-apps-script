const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const getMetadata = require('./functions/getMetadata.js');
const handleError = require('./functions/handleError.js');

/**
 * Display info about a google apps script project
 *
 * @param {string} fileId - Id of the project we want info about.
 */
module.exports = function(identifier) {
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
                                displayInfo(metadata);
                            }
                        });
                    }
                });
            } else {
                getMetadata(auth, identifier, (err, metadata) => {
                    if (err) {
                        handleError(auth, err);
                    } else {
                        displayInfo(metadata);
                    }
                });
            }
        }
    });
};

/**
 * Display info about hte project.
 *
 * @param {Object} metadata Metadata to display.
 */
function displayInfo(metadata) {
    console.log("   name:           " + metadata.name);
    console.log("   id:             " + metadata.id);
    console.log("   description:    " + metadata.description);
    console.log("   createdAt:      " + metadata.createdTime);
    console.log("   lastModifiedAt: " + metadata.modifiedTime);
    return;
}
