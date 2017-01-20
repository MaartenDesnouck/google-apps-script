var authenticate = require('./functions/authenticate.js');
var downloadScript = require('./functions/downloadScript.js')
var unpackRaw = require('./functions/unpackRaw.js');

module.exports = function(fileId) {
    authenticate([], function(err, oauth2Client) {
        if (err) {
            console.log('The API returned an error: ' + err);
        } else {
            downloadScript(oauth2Client, fileId, function(uri) {
                unpackRaw(uri, function(content) {});
            });
        }

    });
};
