var authenticate = require('./authenticate.js');
var google = require('googleapis');

module.exports = function pull() {
    authenticate(downloadFiles);
};

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
    //console.log(file.name + ' : ' + file.mimeType);
    if (file.mimeType == 'application/vnd.google-apps.script') { //&& (file.name.match(regex) != null)) {
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
