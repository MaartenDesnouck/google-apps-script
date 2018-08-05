const fs = require('fs-extra');
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
        process.stdout.write('Succesfully created gas-include.json');
        checkbox.display('green');
        process.exit(0);
    } else {
        process.stdout.write('Failed to create gas-include.json');
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
    let config = {};

    try {
        config = fs.readJsonSync(constants.INCLUDE_FILE, 'utf8');
        // console.log(config);
    } catch (err) {}

    // If there is no version, set version to 1.0.0
    if (!config.version) {
        config.version = '1.0.0';
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    let questionText = `Give your library a name\n >`;
    if (config.name) {
        questionText = `Give your library a name\n(${config.name}) >`;
    }
    rl.question(questionText, (input) => {
        config.name = input;

        // rl.question(`Do you want to use a custom OAuth 2.0 client to authenticate with Google? [${'y'.green}/${'n'.red}]\n > `, (input) => {
        endDialog(true, config);
        rl.close();
        // });
    });
    return;
};
