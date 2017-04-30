var google = require('googleapis');
var constants = require('../constants.js');

/**
 * Lists the names and IDs of all script files.
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {string} nameFilter - String to filter results on.
 * @param {string} nextPageToken - Token of the resultpage to get.
 * @param {callback} callback - The callback that handles the response.
 */
function listScriptFiles(auth, nameFilter, display, nextPageToken, callback) {
    var query = '';
    var allFiles = [];

    if (nameFilter == null) {
        query = "mimeType='" + constants.MIME_GAS + "'";
    } else {
        query = "mimeType='" + constants.MIME_GAS + "' and name contains '" + nameFilter + "'";
    }

    var drive = google.drive('v3');
    drive.files.list({
        auth: auth,
        pageSize: 100,
        fields: "nextPageToken, files(id, name, description, createdTime, modifiedTime)",
        orderBy: 'name',
        q: query,
        spaces: 'drive',
        pageToken: nextPageToken,
    }, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            if (err == 'Error: Invalid Credentials') {
                console.log('Run \'gas auth -f\' to re-authenicate.');
            }
            callback(err);
            return;
        }
        var files = response.files;
        allFiles = allFiles.concat(files);

        if (display) {
            if (nextPageToken == null && files.length === 0) {
                if (nameFilter == null) {
                    console.log("No script projects found in your Google Drive.");
                } else {
                    console.log("No script projects matching your filter found in your Google Drive.");
                }
            }

            for (file of files) {
                console.log("[%s] %s", file.id, file.name);
            }
        }

        if (response.nextPageToken !== undefined) {
            listScriptFiles(auth, nameFilter, response.nextPageToken);
        } else {
            callback(null, allFiles);
            return;
        }
    });
}

module.exports = listScriptFiles;
