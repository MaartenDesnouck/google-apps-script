const google = require('googleapis');
const colors = require('colors');
const constants = require('../constants.js');
const printCheckbox = require('./printCheckbox.js');

/**
 * Lists the names and IDs of script files.
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {string} nameFilter - String to filter results on.
 * @param {bool} display - Wether to display the result or not.
 * @param {string} nextPageToken - Token of the resultpage to get.
 * @param {string} allFiles - String to filter results on.
 * @returns {Promise} - A promise resolving a list of files
 */
function listScriptFiles(auth, nameFilter, display, nextPageToken, allFiles) {
    return new Promise((resolve, reject) => {
        let query = '';
        if (nameFilter) {
            query = `mimeType=\'${constants.MIME_GAS}\' and name contains \'${nameFilter}\'`;
        } else {
            query = `mimeType=\'${constants.MIME_GAS}\'`;
        }

        const drive = google.drive('v3');
        drive.files.list({
            auth,
            pageSize: 100,
            fields: 'nextPageToken, files(id, name, description, createdTime, modifiedTime)',
            orderBy: 'name',
            q: query,
            spaces: 'drive',
            pageToken: nextPageToken,
        }, (err, response) => {
            if (err) {
                reject(err);
                return;
            }

            const files = response.files;
            allFiles = allFiles.concat(files);

            // We display the results after every call so you don't have to wait for all the results
            if (display) {
                if (files.length === 0) {
                    if (!nameFilter) {
                        process.stdout.write(`No script projects found in your Google Drive`);
                        printCheckbox('red');

                    } else {
                        process.stdout.write(`No script projects matching the filter found in your Google Drive`);
                        printCheckbox('red');
                    }
                } else {
                    for (const file of files) {
                        console.log(`[${file.id}] ${file.name}`);
                    }
                }
            }

            // Need to get another page of results?
            if (response.nextPageToken) {
                listScriptFiles(auth, nameFilter, display, response.nextPageToken, allFiles);
            } else {
                resolve(allFiles);
                return;
            }
        });
    });
}

module.exports = listScriptFiles;
