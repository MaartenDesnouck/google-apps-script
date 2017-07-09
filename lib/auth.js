const colors = require('colors');
const authenticate = require('./functions/authenticate.js');
const handleError = require('./functions/handleError.js');
const getUserInfo = require('./functions/getUserInfo.js');

/**
 * Get the metadata of a file with a given id
 *
 * @param {object} options - Extra options.
 * @returns {void}
 */
module.exports = (options) => {
    options.refresh = true;
    authenticate(options, (err, auth) => {
        if (err) {
            handleError(auth, err);
        } else {
            getUserInfo(auth, (err, res) => {
                if (err) {
                    handleError(auth, err);
                } else {
                    console.log('You are succesfully authenticated as \'' + res.email + '\' [' + '✔'.green + ']');
                }
            });
        }
    });
};
