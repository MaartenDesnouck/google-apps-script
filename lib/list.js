var authenticate = require('./authenticate.js');
var google = require('googleapis');

module.exports = function pull() {
    authenticate(listFiles);
};

/**
 * Lists the names and IDs of up to 100 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
    var drive = google.drive('v3');
    drive.files.list({
        auth: auth,
        pageSize: 100,
        fields: "nextPageToken, files(id, name, mimeType)"
    }, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            console.log('Run \'GAS auth\' to re-authenicate.');
            return;
        }
        var files = response.files;
        if (files.length == 0) {
            console.log('No files found.');
        } else {
            //console.log('%s', response.nextPageToken);
            //console.log('%s Files:', files.length);
            for (var file of files) {
                if (file.mimeType == 'application/vnd.google-apps.script') {
                    console.log("(%s), %s", file.id, file.name)
                }
            }
        }
    });
}
