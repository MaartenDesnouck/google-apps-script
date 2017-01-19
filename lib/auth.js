var authenticate = require('./functions/authenticate.js');

module.exports = function(options) {
    authenticate(options, function() {
        console.log('Auth succeeded.')
    });
}
