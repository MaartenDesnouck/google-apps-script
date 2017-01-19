var google = require('googleapis');

/**
 * Lists the names and IDs of all script files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {string} nextPageToken Token of page to get.
 */
module.exports = function(auth, nextPageToken) {
    var drive = google.drive('v3');
    drive.files.list({
        auth: auth,
        pageSize: 100,
        fields: "nextPageToken, files(id, name)",
        q: "mimeType='application/vnd.google-apps.script'",
        spaces: 'drive',
        pageToken: nextPageToken,
    }, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            console.log('Run \'GAS auth\' to re-authenicate.');
            return;
        }
        var files = response.files;

        for (file of files) {
            console.log("(%s) %s", file.id, file.name);
        }

        if (response.nextPageToken !== undefined) {
            listAllScriptFiles(auth, response.nextPageToken)
        }
    });
}
