const colors = require('colors');
const pull = require('./pull.js');
const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const packLocal = require('./functions/packLocal.js');
const pushToRemote = require('./functions/pushToRemote.js');
const downloadRemote = require('./functions/downloadRemote.js');
const getMetadata = require('./functions/getMetadata.js');
const handleError = require('./functions/handleError.js');

/**
 * Push all local code to the remote Google Apps Script project
 *
 * @returns {void}
 */
module.exports = () => {
    process.stdout.write('Pushing code to Google Drive...');
    authenticate([], (err, auth) => {
        if (err) {
            process.stdout.write(' [' + '✘'.red + ']\n');
            handleError(auth, err);
        } else {
            getId((err, fileId, name) => {
                if (err) {
                    process.stdout.write(' [' + '✘'.red + ']\n');
                    handleError(auth, err);
                } else {
                    getMetadata(auth, fileId, (err, metadata) => {
                        if (err) {
                            process.stdout.write(' [' + '✘'.red + ']\n');
                            handleError(auth, err);
                        } else {
                            packLocal((err) => {
                                if (err) {
                                    process.stdout.write(' [' + '✘'.red + ']\n');
                                    handleError(auth, err);
                                } else {
                                    pushToRemote(auth, fileId, (err, result) => {
                                        if (err) {
                                            process.stdout.write(' [' + '✘'.red + ']\n');
                                            handleError(auth, err);
                                        } else {
                                            process.stdout.write(' [' + '✔'.green + ']\n');
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
