var authenticate = require('./authenticate.js');
var google = require('googleapis');
var fs = require('fs');

module.exports = function pull(fileId) {
    authenticate(function(auth) {
        downloadFile(auth, fileId);
    });
};

/**
 * Download file
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {string} fileId Id of file to download.
 */
function downloadFile(auth, fileId) {
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
            }
        })
        .pipe(dest);
}

/**
 * Download files in list
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {files} files List of files to download.
 * @param {string} regex Regular expression to match.
 * @param {int} interval Milliseconds between downloads to limit request rate.
 * @param {int} index Current index in the files list.
 */
function downloadFiles(auth, files, regex, interval, index) {
    var file = files[index];
    if (file.mimeType == 'application/vnd.google-apps.script') {
        var fileId = file.id;
        var uri = 'downloads/' + file.name + '.js';
        var dest = fs.createWriteStream(uri);
        var drive = google.drive('v3');
        drive.files.export({
                auth: auth,
                fileId: fileId,
                //alt: 'media'
                mimeType: 'application/vnd.google-apps.script+json'
            })
            .on('end', function() {
                console.log('Downloaded: %s', file.name);
            })
            .on('error', function(err) {
                console.log('Error during download', err);
                fs.unlink(uri, function() {});
            })
            .pipe(dest);

        index += 1;
        if (index < files.length) {
            setTimeout(function() {
                downloadFiles(auth, files, regex, interval, index);
            }, interval);
        }
    } else {
        index += 1;
        if (index < files.length) {
            downloadFiles(auth, files, regex, interval, index);
        }
    }
}
