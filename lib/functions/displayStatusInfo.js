const constants = require('../constants.js');
const displayCheckbox = require('./displayCheckbox.js');
const fs = require('fs');
const path = require('path');
const colors = require('colors');

/**
 * Display status info about the project.
 *
 * @returns {void}
 */
function displayStatusInfo(metadata) {
    return new Promise((resolve, reject) => {
        const local = path.join(constants.META_DIR, constants.META_LOCAL);
        const remote = path.join(constants.META_DIR, constants.META_REMOTE);

        const files = [];
        const keys = [];
        const data = [];
        data['local'] = JSON.parse(fs.readFileSync(local, 'utf8'));
        data['remote'] = JSON.parse(fs.readFileSync(remote, 'utf8'));

        // Construct array with filename, extension and environment as key
        for (env in data) {
            for (const codeFile of data[env].files) {
                const extension = (codeFile.type === 'html' ? '.html' : '.js');
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
        for (var i = 0; i < keys.length; i++) {
            const file = files[keys[i]];
            const extension = (file.type === 'html' ? '.html' : '.js');
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
            process.stdout.write(`Your local files and Google Drive for '${metadata.name}' are in sync`);
            displayCheckbox(`green`);
        } else {
            process.stdout.write(`There are some difference between your local files and Google Drive for '${metadata.name}'`);
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
    });
}

module.exports = displayStatusInfo;
