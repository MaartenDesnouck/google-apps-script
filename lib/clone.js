var authenticate = require('./functions/authenticate.js');
var downloadRemote = require('./functions/downloadRemote.js')
var unpackRemote = require('./functions/unpackRemote.js');

module.exports = function(fileId, name, callback) {
    console.log('Cloning project from Google Drive...');
    authenticate([], function(err, oauth2Client) {
        if (err) {
            console.log('gas returned an error: ' + err);
        } else {
            if(name == null){
              name = 'temp';
            }
            downloadRemote(oauth2Client, fileId, name, 'clone', function(err) {
                if (err) {
                    console.log('gas returned an error: ' + err);
                } else {
                    unpackRemote(name, function(err) {
                        if (err) {
                            console.log('gas returned an error: ' + err);
                        } else {
                            console.log('Succesfully cloned from Google Drive.');
                        }
                    });
                }
            });
        }
    });
};
