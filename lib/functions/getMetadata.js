const google = require('googleapis');
const fs = require('fs');
const sanitize = require('sanitize-filename');
const colors = require('colors');
const constants = require('../constants.js');
const listScriptFiles = require('./listScriptFiles.js');

/**
 * Get the metadata of a file with a given id
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {string} identifier - Identifier we want to get data from, could be id or a name.
 * @param {callback} callback - The callback that handles the response.
 */
function getMetadata(auth, identifier, callback) {
    // Test if identifier is an id
    listScriptFiles(auth, null, false, null, [], function(err, files) {
        for (var file of files) {
            if (file.id === identifier) {
                callback(null, file);
                return;
            }
        }

        // Identifier did not match an id
        listScriptFiles(auth, identifier, false, null, [], function(err, files) {
            if (err) {
                callback(err);
                return;
            } else {
                if (files.length === 0) { // 0 results
                    err = {
                        message: 'No project with name or id \'' + identifier + '\' found in your Google Drive',
                        output: false
                    };
                    callback(err);
                    console.log('No project with name or id \'' + identifier + '\' found in your Google Drive [' + '✘'.red + ']');
                    console.log('Use \'gas list\' to show all the projects in your Google Drive.');
                } else if (files.length === 1) { // 1 result
                    var result = files[0];
                    if (result.name === identifier) {
                        result.name = sanitize(result.name);
                        callback(null, result);
                        return;
                    } else {
                        // Check for exact match if exists
                        err = {
                            message: 'No exact match with name or id \'' + identifier + '\' found in your Google Drive',
                            output: false
                        };
                        callback(err);
                        console.log('No exact match found in your Google Drive [' + '✘'.red + ']');
                        console.log('Did you perhaps mean: \'' + result.name + '\'?');
                    }
                } else { // More than 1 result
                    var exactMatches = [];
                    for (var match of files) {
                        if (match.name === identifier) {
                            exactMatches.push(match);
                        }
                    }
                    if (exactMatches.length === 0) { // 0 results
                        err = {
                            message: 'No project called \'' + identifier + '\' found in your Google Drive',
                            output: false
                        };
                        callback(err);
                        console.log('No project called \'' + identifier + '\' found in your Google Drive [' + '✘'.red + ']');
                        console.log('Did you mean one of these projects? :');
                        for (var file2 of files) {
                            console.log("[%s] %s", file2.id, file2.name);
                        }
                    } else if (exactMatches.length === 1) { // 1 result
                        exactMatches[0].name = sanitize(exactMatches[0].name);
                        callback(null, exactMatches[0]);
                        return;
                    } else {
                        err = {
                            message: 'Multiple projects called \'' + identifier + '\' found in your Google Drive',
                            output: false
                        };
                        callback(err);
                        console.log('Multiple projects called \'' + identifier + '\' found in your Google Drive [' + '✘'.red + ']');
                        console.log('Use \'gas rename <fileId> <newName>\' to rename projects so they have a unique name or use the fileId as identifier');
                        for (var exactMatch of exactMatches) {
                            console.log("[%s] %s", exactMatch.id, exactMatch.name);
                        }
                        return;
                    }
                }
            }
        });
    });
}

module.exports = getMetadata;
