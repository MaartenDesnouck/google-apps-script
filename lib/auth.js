var authenticate = require('./functions/authenticate.js');

/**
 * Get the metadata of a file with a given id
 *
 * @param {object} options - Extra options.
 */
module.exports = function(options, callback) {
    authenticate(options, function(err, token) {
      if (err) {
          console.log('gas returned an error: ' + err);
      } else {
          console.log('You are succesfully authenticated.');
      }
    });
}
