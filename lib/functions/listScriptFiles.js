var google = require('googleapis');

/**
 * Lists the names and IDs of all script files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {string} nextPageToken Token of page to get.
 */
module.exports = function(auth, nameFilter, nextPageToken) {
    var query = '';

    if (nameFilter == null) {
        query = "mimeType='application/vnd.google-apps.script'";
    } else {
        query = "mimeType='application/vnd.google-apps.script' and name contains '" + nameFilter + "'";
    }

    var drive = google.drive('v3');
    drive.files.list({
        auth: auth,
        pageSize: 100,
        fields: "nextPageToken, files(id, name)",
        q: query,
        spaces: 'drive',
        pageToken: nextPageToken,
    }, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            if (err == 'Error: Invalid Credentials') {
                console.log('Run \'gas auth -f\' to re-authenicate.');
            }
            return;
        }
        var files = response.files;

        for (file of files) {
            console.log("[%s] %s", file.id, file.name);
        }

        if (response.nextPageToken !== undefined) {
            listAllScriptFiles(auth, nameContains, response.nextPageToken);
        }
    });
}
