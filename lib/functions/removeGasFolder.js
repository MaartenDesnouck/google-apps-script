var google = require('googleapis');
var fs = require('fs');
var constants = require('../constants.js');

/**
 * Download scriptfile
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {string} fileId Id of file to download.
 */
module.exports = function(auth, fileId, method, callback) {
    var dir = constants.META_DIR;
    var uri = '';

    switch (method) {
        case 'clone':
            if (fs.existsSync(dir)) {
                callback('You seem to be cloning in a directory already containing a .gas folder.');
                return;
            } else {
                fs.mkdirSync(dir);
                uri = dir + constants.META_REMOTE;
            }
            break;
        case 'pull':
            uri = dir + constants.META_REMOTE;
            break;
        default:
            callback('Unsupported method.');
            return;
            break;
    }

    fs.writeFile(dir + constants.META_ID, fileId, function() {});

    var dest = fs.createWriteStream(uri);
    var drive = google.drive('v3');
    drive.files.export({
            auth: auth,
            fileId: fileId,
            mimeType: 'application/vnd.google-apps.script+json'
        }, function(err, result) {
            if (err) {
                fs.unlink(uri, function() {});
                callback(err);
            }
        })
        .pipe(dest);

    dest.on('finish', function() {
        callback();
    });

}
