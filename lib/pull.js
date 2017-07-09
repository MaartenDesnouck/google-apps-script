const colors = require('colors');
const readline = require('readline');
const include = require('./include.js');
const authenticate = require('./functions/authenticate.js');
const downloadRemote = require('./functions/downloadRemote.js');
const unpackRemote = require('./functions/unpackRemote.js');
const getMetadata = require('./functions/getMetadata.js');
const getId = require('./functions/getId.js');
const handleError = require('./functions/handleError.js');
const printCheckbox = require('./functions/printCheckbox.js');

/**
 * Pull code from a linked remote Google Apps Script project
 *
 * @param {object} options - Extra options.
 * @returns {void}
 */
module.exports = (options) => {
    process.stdout.write('Pulling from Google Drive...');
    authenticate([], (err, auth) => {
        if (err) {
            handleError(auth, err, true);
        } else {
            getId((err, fileId, dir) => {
                if (err) {
                    handleError(auth, err, true);
                } else {
                    getMetadata(auth, fileId, (err, metadata) => {
                        if (err) {
                            handleError(auth, err, true);
                        } else {
                            process.stdout.clearLine();
                            readline.cursorTo(process.stdout, 0);
                            process.stdout.write(`Pulling \'${metadata.name}\' from Google Drive...`);
                            downloadRemote(auth, fileId, dir, 'pull', (err) => {
                                if (err) {
                                    handleError(auth, err, true);
                                } else {
                                    unpackRemote(dir, (err) => {
                                        if (err) {
                                            handleError(auth, err, true);
                                        } else {
                                            printCheckbox('green');
                                            if (options.include) {
                                                include();
                                            }
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
