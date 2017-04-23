var google = require('googleapis');
var fs = require('fs');
var constants = require('../constants.js');

/**
 * Download script json from Google Drive
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {string} fileId - Id of file to download.
 * @param {string} dir - Optional directory in which the project is located.
 * @param {string} method - Identifier for the flow calling this function.
 * @param {callback} callback
 */
function downloadRemote(auth, fileId, dir, method, callback) {
    if (dir) {
        var gasDir = './' + dir + '/' + constants.META_DIR;
    } else {
        var gasDir = constants.META_DIR;
    }

    switch (method) {
        case 'clone':
            if (fs.existsSync(gasDir)) {
                callback('Oops, you seem to be cloning in a directory already containing a .gas folder!');
                callback('Please check your project strucure and try again.');
                return;
            } else {
                if (dir) {
                    fs.mkdirSync('./' + dir + '/');
                }
                fs.mkdirSync(gasDir);
            }
            break;
        case 'pull':
            break;
        default:
            callback('Unsupported method.');
            return;
            break;
    }

    fs.writeFile(gasDir + constants.META_ID, fileId, function() {});

    var dest = fs.createWriteStream(gasDir + constants.META_REMOTE);
    var drive = google.drive('v3');

    drive.files.export({
        auth: auth,
        fileId: fileId,
        mimeType: 'application/vnd.google-apps.script+json'
    }, function(err, result) {
        if (err) {
            fs.unlink(gasDir + constants.META_REMOTE, function() {});
            callback(err);
        }
    }).pipe(dest);

    dest.on('finish', function() {
        callback();
    });

}

module.exports = downloadRemote;
