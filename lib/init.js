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
 * Enter a configuration using questions in the terminal
 * 
 * @returns {void}
 */
function enterConfig() {
    const config = {};
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question(`Do you want to use .gs as extension for your local code files instead of .js? [${'y'.green}/${'n'.red}]\n > `, (input) => {
        if (input === 'y') {
            config.extension = '.gs';
        } else if (input !== 'n') {
            endDialog(false);
            rl.close();
        }

        rl.question(`Do you want to use a custom OAuth 2.0 client to authenticate with Google Drive? [${'y'.green}/${'n'.red}]\n > `, (input) => {
            if (input === 'y') {
                config.client = {};
                console.log();
                rl.question(`Enter the 'Client ID' of your client \n > `, (input) => {
                    config.client.id = input;
                    rl.question(`Enter the 'Client secret' of your client\n > `, (input) => {
                        config.client.secret = input;

                        // Remove token file to force reauth
                        fs.removeSync(tokenFile);

                        endDialog(true, config);
                        rl.close();
                    });
                });
            } else if (input === 'n') {
                endDialog(true, config);
                rl.close();
            } else {
                endDialog(false);
                rl.close();
            }
        });
    });
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
