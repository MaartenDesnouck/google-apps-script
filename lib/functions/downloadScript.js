var google = require('googleapis');
var fs = require('fs');

/**
 * Download scriptfile
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {string} fileId Id of file to download.
 */
module.exports = function(auth, fileId, callback) {
    var fileName = 'test';
    var uri = 'downloads/' + fileName + '.js';
    var dest = fs.createWriteStream(uri);
    var drive = google.drive('v3');
    drive.files.export({
            auth: auth,
            fileId: fileId,
            mimeType: 'application/vnd.google-apps.script+json'
        }, function(result) {
            if (result != null) {
                console.log("" + result);
                fs.unlink(uri, function() {});
            } else {
                fs.readFile(uri, 'utf8', function(err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    var result = JSON.parse(data);
                    if (result['access_token']) {
                        console.log(result['access_token']);
                    }
                });
            }
        })
        .pipe(dest);
}
