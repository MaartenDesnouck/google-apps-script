const colors = require('colors');
const authenticate = require('./functions/authenticate.js');
const handleError = require('./functions/handleError.js');

/**
 * Get the metadata of a file with a given id
 *
 * @param {object} options - Extra options.
 */
module.exports = function(options) {
    options.refresh = true;
    authenticate(options, function(err, oauth2Client) {
        if (err) {
            handleError(err);
        } else {
            console.log('You are succesfully authenticated [' + '✔'.green + ']');
        }
    });
}
