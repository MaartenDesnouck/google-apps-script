const google = require('googleapis');
const sanitize = require('sanitize-filename');
const listScriptFiles = require('./listScriptFiles.js');
const checkbox = require('./checkbox.js');

/**
 * Get the metadata of a file with a given id
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {String} identifier - Identifier we want to get data from, could be id or a name.
 * @returns {Object} - metadata of the project
 */
async function getMetadata(auth, identifier) {
    // Try to get info assuming identifier is an id
    const metadata = await new Promise((resolve, reject) => {
        const script = google.script('v1');
        script.projects.get({
            auth,
            scriptId: identifier,
        }, (err, result) => {
            if (err) {
                resolve(false);
            } else {
                resolve(result);
            }
            return;
        });
    });
    if (metadata) {
        return metadata;
    }

    // Identifier did not match an id
    files = await listScriptFiles(auth, identifier, false, null, []);
    if (files.length === 0) { // 0 results
        throw {
            message: `No project with title or id '${identifier}' found in your Google Drive ${checkbox.get('red')}\n` +
                `Use 'gas list' to show all the projects in your Google Drive`,
            print: true,
        };
    } else if (files.length === 1) { // 1 result
        const result = files[0];
        if (result.name === identifier) {
            result.name = sanitize(result.name);
            return {
                scriptId: result.id,
                title: result.name,
                createTime: result.createdTime,
                updateTime: result.modifiedTime,
                creator: {
                    name: '',
                    email: '',
                },
            };
        } else {
            // Check for exact match if exists
            throw {
                message: `No exact match with title or id '${identifier}' found in your Google Drive ${checkbox.get('red')}\n` +
                    `Did you perhaps mean: '${result.name}'?`,
                print: true,
            };
        }
    } else { // More than 1 result
        const exactMatches = [];
        for (const match of files) {
            if (match.name === identifier) {
                exactMatches.push(match);
            }
        }
        if (exactMatches.length === 0) { // 0 results
            let message = `No project called '${identifier}' found in your Google Drive ${checkbox.get('red')}\n`;
            message += 'Did you mean one of these projects? :\n';
            for (const file2 of files) {
                message += `[${file2.id}] ${file2.name}\n`;
            }
            const err = {
                message,
                print: true,
            };
        } else if (exactMatches.length === 1) { // 1 result
            exactMatches[0].name = sanitize(exactMatches[0].name);
            return {
                scriptId: exactMatches[0].id,
                title: exactMatches[0].name,
                createTime: exactMatches[0].createdTime,
                updateTime: exactMatches[0].lastModifiedAt,
                creator: {
                    name: '',
                    email: '',
                }, 
            };
        } else {
            let message = `Multiple projects called '${identifier}' found in your Google Drive ${checkbox.get('red')}\n`;
            message += `Use 'gas rename <scriptId> <newScriptTitle>' to rename script so they have a unique title or use the scriptId as identifier\n\n`;
            for (const exactMatch of exactMatches) {
                message += `[${exactMatch.id}] ${exactMatch.name}\n`;
            }
            throw {
                message,
                print: true,
            };
        }
    }
}

module.exports = getMetadata;
