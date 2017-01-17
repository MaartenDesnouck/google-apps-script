var authenticate = require('./authenticate.js');
var google = require('googleapis');

module.exports = function pull() {
    authenticate(function(auth) {
        // getAllScriptFiles(auth, null, [], function(files) {
        //     for (file of files) {
        //         console.log("(%s) %s", file.id, file.name);
        //     }
        // });

        listAllScriptFiles(auth, null);

    });
};

/**
 * Resturns the names and IDs all script files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {string} nextPageToken Token of page to get.
 * @param {Object[]} result Results so far.
 * @param {requestCallback} callback The callback that handles the response.
 */
function getAllScriptFiles(auth, nextPageToken, result, callback) {
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
        result = result.concat(files);

        if (response.nextPageToken == undefined) {
            callback(result);
        } else {
            getAllScriptFiles(auth, response.nextPageToken, result, callback)
        }
    });
}

/**
 * Lists the names and IDs of all script files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {string} nextPageToken Token of page to get.
 */
function listAllScriptFiles(auth, nextPageToken) {
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
