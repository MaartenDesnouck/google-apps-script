var authenticate = require('./authenticate.js');

module.exports = function auth() {
    authenticate(function(){
      console.log('Auth succeeded.')
    });
}
