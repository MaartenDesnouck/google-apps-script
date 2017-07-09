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
 * @returns {void}
 */
function getMetadata(auth, identifier, callback) {
    // Test if identifier is an id
    listScriptFiles(auth, null, false, null, [], (err, files) => {
        for (const file of files) {
            if (file.id === identifier) {
                callback(null, file);
                return;
            }
        }

        // Identifier did not match an id
        listScriptFiles(auth, identifier, false, null, [], (err, files) => {
            if (err) {
                callback(err);
                return;
            } else {
                if (files.length === 0) { // 0 results
                    const err = {
                        message: 'No project with name or id \'' + identifier + '\' found in your Google Drive',
                        output: false,
                    };
                    console.log('No project with name or id \'' + identifier + '\' found in your Google Drive [' + '✘'.red + ']');
                    console.log('Use \'gas list\' to show all the projects in your Google Drive.');
                    callback(err);
                    return;
                } else if (files.length === 1) { // 1 result
                    const result = files[0];
                    if (result.name === identifier) {
                        result.name = sanitize(result.name);
                        callback(null, result);
                        return;
                    } else {
                        // Check for exact match if exists
                        const err = {
                            message: 'No exact match with name or id \'' + identifier + '\' found in your Google Drive',
                            output: false,
                        };
                        console.log('No exact match found in your Google Drive [' + '✘'.red + ']');
                        console.log('Did you perhaps mean: \'' + result.name + '\'?');
                        callback(err);
                        return;
                    }
                } else { // More than 1 result
                    var exactMatches = [];
                    for (const match of files) {
                        if (match.name === identifier) {
                            exactMatches.push(match);
                        }
                    }
                    if (exactMatches.length === 0) { // 0 results
                        const err = {
                            message: 'No project called \'' + identifier + '\' found in your Google Drive',
                            output: false,
                        };
                        console.log('No project called \'' + identifier + '\' found in your Google Drive [' + '✘'.red + ']');
                        console.log('Did you mean one of these projects? :');
                        for (const file2 of files) {
                            console.log("[%s] %s", file2.id, file2.name);
                        }
                        callback(err);
                        return;
                    } else if (exactMatches.length === 1) { // 1 result
                        exactMatches[0].name = sanitize(exactMatches[0].name);
                        callback(null, exactMatches[0]);
                        return;
                    } else {
                        const err = {
                            message: 'Multiple projects called \'' + identifier + '\' found in your Google Drive',
                            output: false,
                        };
                        console.log('Multiple projects called \'' + identifier + '\' found in your Google Drive [' + '✘'.red + ']');
                        console.log('Use \'gas rename <fileId> <newName>\' to rename projects so they have a unique name or use the fileId as identifier');
                        for (const exactMatch of exactMatches) {
                            console.log("[%s] %s", exactMatch.id, exactMatch.name);
                        }
                        callback(err);
                        return;
                    }
                }
            }
        });
    });
}

module.exports = getMetadata;
