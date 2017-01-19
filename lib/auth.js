var authenticate = require('./functions/authenticate.js');

module.exports = function auth(options) {
    authenticate(options, function(){
      console.log('Auth succeeded.')
    });
}
