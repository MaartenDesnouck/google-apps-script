const pull = require('./pull.js');
const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const packLocal = require('./functions/packLocal.js');
const pushToRemote = require('./functions/pushToRemote.js');
const downloadRemote = require('./functions/downloadRemote.js');
const getMetadata = require('./functions/getMetadata.js');
const handleError = require('./functions/handleError.js');
const printCheckbox = require('./functions/printCheckbox.js');

/**
 * Push all local code to the remote Google Apps Script project
 *
 * @returns {void}
 */
module.exports = () => {
    process.stdout.write('Pushing code to Google Drive...');
    authenticate([], (err, auth) => {
        if (err) {
            handleError(auth, err, true);
        } else {
            getId((err, fileId, name) => {
                if (err) {
                    handleError(auth, err, true);
                } else {
                    getMetadata(auth, fileId, (err, metadata) => {
                        if (err) {
                            handleError(auth, err, true);
                        } else {
                            packLocal((err) => {
                                if (err) {
                                    handleError(auth, err, true);
                                } else {
                                    pushToRemote(auth, fileId, (err, result) => {
                                        if (err) {
                                            handleError(auth, err, true);
                                        } else {
                                            printCheckbox('green');
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
