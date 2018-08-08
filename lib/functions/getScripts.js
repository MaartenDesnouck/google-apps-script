const {
    google,
} = require('googleapis');
const constants = require('../constants.js');
const triageGoogleError = require('./triageGoogleError.js');

/**
 * Lists the names and IDs of script files.
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {String} nameFilter - String to filter results on.
 * @param {String} nextPageToken - Token of the resultpage to get.
 * @param {String} allFiles - String to filter results on.
 * @returns {Promise} - A promise resolving a list of files
 */
function getScripts(auth, nameFilter, nextPageToken, allFiles) {
    return new Promise((resolve, reject) => {
        let query = '';
        if (nameFilter) {
            query = `mimeType='${constants.MIME_GAS}' and name contains '${nameFilter}'`;
        } else {
            query = `mimeType='${constants.MIME_GAS}'`;
        }

        const drive = google.drive('v3');
        drive.files.list({
            auth,
            pageSize: 1000,
            fields: 'nextPageToken, files(id, name, description, createdTime, modifiedTime)',
            orderBy: 'name',
            includeTeamDriveItems: true,
            supportsTeamDrives: true,
            q: query,
            spaces: 'drive',
            pageToken: nextPageToken,
        }, (err, response) => {
            if (err) {
                triageGoogleError(err, 'listScriptFiles').then((triaged) => {
                    reject(triaged);
                }).catch((notTriaged) => {
                    reject(notTriaged);
                });
                return;
            }

            const files = response.data.files;
            allFiles = allFiles.concat(files);

            // Need to get another page of results?
            if (response.nextPageToken) {
                getScripts(auth, nameFilter, response.nextPageToken, allFiles).then((allFiles) => {
                    resolve(allFiles);
                }).catch((err) => {
                    reject(err);
                });
                return;
            } else {
                resolve(allFiles);
                return;
            }
        });
    });
}

module.exports = getScripts;
