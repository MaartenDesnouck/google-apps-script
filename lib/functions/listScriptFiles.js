const google = require('googleapis');
const colors = require('colors');
const constants = require('../constants.js');

/**
 * Lists the names and IDs of script files.
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {string} nameFilter - String to filter results on.
 * @param {string} nextPageToken - Token of the resultpage to get.
 * @param {callback} callback - The callback that handles the response.
 */
function listScriptFiles(auth, nameFilter, display, nextPageToken, allFiles, callback) {
    var query = '';

    if (nameFilter === null) {
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
            callback(err);
            return;
        }
        const files = response.files;
        allFiles = allFiles.concat(files);

        // We display the results after every call so you don't have to wait for all the results
        if (display) {
            if (files.length === 0) {
                if (nameFilter === undefined) {
                    console.log('No script projects found in your Google Drive [' + '✘'.red + ']');
                } else {
                    console.log('No script projects matching the filter found in your Google Drive [' + '✘'.red + ']');
                }
            } else {
                for (const file of files) {
                    console.log("[%s] %s", file.id, file.name);
                }
            }
        }

        // Need to get another page of results?
        if (response.nextPageToken !== undefined) {
            listScriptFiles(auth, nameFilter, display, response.nextPageToken, allFiles, callback);
        } else {
            callback(null, allFiles);
            return;
        }
    });
}

module.exports = listScriptFiles;
