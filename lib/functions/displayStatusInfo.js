const fs = require('fs-extra');
const path = require('path');
const colors = require('colors');
const checkbox = require('./checkbox.js');
const eaft = require('./extensionAndFiletype.js');
const constants = require('../constants.js');

/**
 * Display status info about the project.
 *
 * @param {String} rootFolder - relative path to the rootFolder of the project
 * @param {Object} metadata - Metadata of the projectso we can give extra info.
 * @returns {void}
 */
async function displayStatusInfo(rootFolder, metadata) {
    const local = path.join(rootFolder, constants.META_DIR, constants.META_LOCAL);
    const remote = path.join(rootFolder, constants.META_DIR, constants.META_REMOTE);

    // Get valid extensions for code files
    const extensions = eaft.getCodeExtensions();

    const files = [];
    const keys = [];
    const data = [];
    data.local = JSON.parse(fs.readFileSync(local, 'utf8'));
    data.remote = JSON.parse(fs.readFileSync(remote, 'utf8'));

    // Construct array with filename, extension and environment as key
    for (const env in data) {
        for (const codeFile of data[env].files) {
            const extension = eaft.getExtensionFromFiletype(codeFile.type, extensions);
            const key = `${codeFile.name}${extension}.${env}`;
            keys.push(key);
            codeFile.environment = env;
            files[key] = codeFile;
        }
    }

    // Sort keys
    keys.sort();

    // Track what we need to print
    const addedFiles = [];
    const modifiedFiles = [];
    const deletedFiles = [];

    // Iterate over all keys
    for (let i = 0; i < keys.length; i++) {
        const file = files[keys[i]];
        const extension = eaft.getExtensionFromFiletype(file.type, extensions);
        const nextFile = files[keys[i + 1]];

        if (nextFile && file.name === nextFile.name && file.type === nextFile.type) {
            // We can skip 1 ahead
            i++;
            if (file.source !== nextFile.source) {
                modifiedFiles.push(file.name + extension);
            }
        } else if (file.environment === 'local') {
            addedFiles.push(file.name + extension);
        } else if (file.environment === 'remote') {
            deletedFiles.push(file.name + extension);
        }
    }

    // Display something if everything is ok
    if (addedFiles.length === 0 && modifiedFiles.length === 0 && deletedFiles.length === 0) {
        process.stdout.write(`Your local and remote project for '${metadata.name}' are in sync`);
        checkbox.display(`green`);
    } else {
        process.stdout.write(`There are some differences between your local and remote projectfiles for '${metadata.name}'`);
        console.log(``);

        // Display added files
        if (addedFiles.length > 0) {
            console.log(``);
        }
        for (const added of addedFiles) {
            console.log(`   + ${added}`.green);
        }

        // Display modified files
        if (modifiedFiles.length > 0) {
            console.log(``);
        }
        for (const modified of modifiedFiles) {
            console.log(`   ~ ${modified}`.yellow);
        }

        // Display removed files
        if (deletedFiles.length > 0) {
            console.log(``);
        }
        for (const deleted of deletedFiles) {
            console.log(`   - ${deleted}`.red);
        }
        console.log(``);
    }
}

module.exports = displayStatusInfo;
