var authenticate = require('./functions/authenticate.js');
var handleError = require('./functions/handleError.js');
var colors = require('colors');

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
