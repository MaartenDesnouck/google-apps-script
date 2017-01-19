var authenticate = require('./functions/authenticate.js');
var downloadScript = require('./functions/downloadScript.js')
var unpackRaw = require('./functions/unpackRaw.js');

module.exports = function(fileId) {
    authenticate([], function(auth) {
        downloadScript(auth, fileId, function(uri) {
            unpackRaw(uri, function(content) {});
        });
    });
};
