var authenticate = require('./functions/authenticate.js');
var downloadScript = require('./functions/downloadScript.js')

module.exports = function pull(fileId) {
    authenticate([], function(auth) {
        downloadScript(auth, fileId);
    });
};
