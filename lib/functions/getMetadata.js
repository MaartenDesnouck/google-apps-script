var google = require('googleapis');
var fs = require('fs');
var constants = require('../constants.js');
var sanitize = require('sanitize-filename');
var listScriptFiles = require('./listScriptFiles.js');

/**
 * Get the metadata of a file with a given id
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {string} identifier - Identifier we want to get data from, could be id or a name.
 * @param {callback} callback - The callback that handles the response.
 */
function getMetadata(auth, identifier, callback) {
    var drive = google.drive('v3');
    drive.files.get({
        auth: auth,
        fileId: identifier,
        mimeType: constants.MIME_GAS_JSON
    }, function(err, result) {
        if (err) {
            listScriptFiles(auth, identifier, false, null, function(err, files) {
                if (err) {
                    callback(err);
                } else {

                    if (files.length === 0) { // 0 results
                        console.log('No project called \'' + identifier + '\' found in your Google Drive.');
                        console.log('Use \'gas list\' to show all the projects in your Google Drive.')
                    } else if (files.length === 1) { // 1 result
                        var result = files[0];
                        if (result.name === identifier) {
                            callback(null, result.id, sanitize(result.name), constants.MIME_GAS);
                        } else {
                            //check for exact match if exists
                            console.log('No exact match found in your Google Drive. Did you perhaps mean: \'' + result.name + '\'?')
                        }
                    } else { //More than 1 result
                        var exactMatches = [];
                        for (result in files) {
                            if (files[result].name === identifier) {
                                exactMatches.push(files[result]);
                            }
                        }
                        if (exactMatches.length === 0) { // 0 results
                            console.log('No project called \'' + identifier + '\' found in your Google Drive.');
                            console.log('Did you mean one of these projects? :');
                            for (result in files) {
                                console.log("[%s] %s", files[result].id, files[result].name);
                            }
                        } else if (exactMatches.length === 1) { // 1 result
                            callback(null, exactMatches[0].id, sanitize(exactMatches[0].name), constants.MIME_GAS);
                        } else {
                            console.log('Multiple projects called \'' + identifier + '\' found in your Google Drive.');
                            console.log('Use \'gas rename <fileId> <newName>\' to rename projects so they have a unique name or use the fileId as identifier');
                            for (result in files) {
                                console.log("[%s] %s", files[result].id, files[result].name);
                            }
                        }
                    }
                }
            });
        } else {
            callback(null, result.id, sanitize(result.name), result.mimeType);
        }
    });
}

module.exports = getMetadata;
