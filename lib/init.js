const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');
const constants = require('./constants.js');
const checkbox = require('./functions/checkbox.js');
const createFile = require('./functions/createFile.js');

/**
 * Create a package.json file based on the values provided
 *
 * @param {Object} content - Package.json to create
 * @returns {void}
 */
function createPackageFile(content) {
    // todo in the rootfolder
    createFile({
        name: constants.INCLUDE_FILE,
        source: `${JSON.stringify(content)}\n`,
    });
}

/**
 * Create a package file based on the values provided
 *
 * @param {String} success - Whether or not the dialog completed succesfully
 * @param {String} content - Package.json to create
 * @returns {void}
 */
function endDialog(success, content) {
    if (success) {
        createPackageFile(content);
        console.log();
        process.stdout.write('Succesfully created package.json');
        checkbox.display('green');
        process.exit(0);
    } else {
        process.stdout.write('Failed to create package.json');
        checkbox.display('red');
        process.exit(1);
    }
}

/**
 * Interactively configure package.json
 *
 * @returns {void}
 */
module.exports = () => {
    console.log('Initialising gas-include.json...');
    return;
};
