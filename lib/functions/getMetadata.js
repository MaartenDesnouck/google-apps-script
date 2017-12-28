const sanitize = require('sanitize-filename');
const listScriptFiles = require('./listScriptFiles.js');
const displayCheckbox = require('./displayCheckbox.js');

/**
 * Get the metadata of a file with a given id
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {String} identifier - Identifier we want to get data from, could be id or a name.
 * @returns {Object} - metadata of the project or false if none or multiple projects were found
 */
async function getMetadata(auth, identifier) {
    // Test if identifier is an id
    let files;
    files = await listScriptFiles(auth, null, false, null, []);
    for (const file of files) {
        if (file.id === identifier) {
            return file;
        }
    }

    // Identifier did not match an id
    files = await listScriptFiles(auth, identifier, false, null, []);
    if (files.length === 0) { // 0 results
        const err = {
            message: `No project with name or id '${identifier}' found in your Google Drive`,
            output: false,
            displayCheckbox: false,
        };
        process.stdout.write(`No project with name or id '${identifier}' found in your Google Drive`);
        displayCheckbox('red');
        process.stdout.write('Use \'gas list\' to show all the projects in your Google Drive\n');
        return false;
    } else if (files.length === 1) { // 1 result
        const result = files[0];
        if (result.name === identifier) {
            result.name = sanitize(result.name);
            return result;
        } else {
            // Check for exact match if exists
            const err = {
                message: `No exact match with name or id '${identifier}' found in your Google Drive`,
                output: false,
                displayCheckbox: false,
            };
            process.stdout.write('\nNo exact match found in your Google Drive');
            displayCheckbox('red');
            process.stdout.write(`Did you perhaps mean: '${result.name}'?\n`);
            displayCheckbox('red');
            return false;
        }
    } else { // More than 1 result
        const exactMatches = [];
        for (const match of files) {
            if (match.name === identifier) {
                exactMatches.push(match);
            }
        }
        if (exactMatches.length === 0) { // 0 results
            const err = {
                message: `No project called '${identifier}' found in your Google Drive`,
                output: false,
                displayCheckbox: false,
            };
            process.stdout.write(`No project called '${identifier}' found in your Google Drive`);
            displayCheckbox('red');
            process.stdout.write('Did you mean one of these projects? :\n');
            for (const file2 of files) {
                console.log("[%s] %s", file2.id, file2.name);
            }
            return false;
        } else if (exactMatches.length === 1) { // 1 result
            exactMatches[0].name = sanitize(exactMatches[0].name);
            return exactMatches[0];
        } else {
            const err = {
                message: `Multiple projects called '${identifier}' found in your Google Drive`,
                output: false,
                displayCheckbox: false,
            };
            process.stdout.write(`Multiple projects called '${identifier}' found in your Google Drive`);
            displayCheckbox('red');
            process.stdout.write(`\nUse 'gas rename <projectId> <newName>' to rename projects so they have a unique name or use the projectId as identifier\n\n`);
            for (const exactMatch of exactMatches) {
                console.log("[%s] %s", exactMatch.id, exactMatch.name);
            }
            return false;
        }
    }
}

module.exports = getMetadata;
