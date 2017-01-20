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
    var dir = './.gaps';
    var uri = '';

    switch (method) {
        case 'clone':
            if (fs.existsSync(dir)) {
                callback('You seem to be cloning in a directory already containing a .gaps folder.', null);
                return;
            } else {
                fs.mkdirSync(dir);
                uri = dir + '/remote.json';
            }
            break;
        case 'pull':
            uri = dir + '/remote.json';
            break;
        default:
            callback('Unsupported method.', null);
            return;
            break;
    }

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
                        try {
                            fs.mkdirSync(constants.TOKEN_DIR, function() {});
                        } catch (err) {
                            if (err.code != 'EEXIST') {
                                throw err;
                            }
                        }
                        fs.writeFile(constants.TOKEN_DIR + constants.TOKEN_FILE, data, function() {});
                    }
                    callback(null, uri);
                    return;
                });
            }
        })
        .pipe(dest);
}
