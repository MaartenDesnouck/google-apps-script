const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');
const constants = require('./constants.js');
const displayCheckbox = require('./functions/displayCheckbox.js');
const createFile = require('./functions/createFile.js');

const configFilepath = path.join(constants.GLOBAL_DIR, constants.GLOBAL_CONFIG);

/**
 * Create a config file based on the values provided
 *
 * @param {object} config - The config to create
 * @returns {void}
 */
function createConfigFile(config) {
    createFile({
        name: configFilepath,
        source: JSON.stringify(config) + '\n'
    });
}

/**
 * Create a config file based on the values provided
 * 
 * @param {string} success - Whether or not the dialog completed succesfully
 * @param {string} config - The config we created trough the dialog
 * @returns {void}
 */
function endDialog(success, config) {
    if (success) {
        // console.log(config);
        createConfigFile(config);
        console.log();
        process.stdout.write('Succesfully configured gas.');
        displayCheckbox('green');
    } else {
        console.log(`Only 'y' and 'n' are accepted inputs.`);
        process.stdout.write('Failed to configure gas.');
        displayCheckbox('red');
        process.exit(1);
    }
}

/**
 * Configure the tool with some settings
 *
 * @param {string} optionalPath - Either the path the a config file to import or the location to which we need to export the config
 * @param {string} options - Extra options.
 * @returns {void}
 */
module.exports = (optionalPath, options) => {
    // gas config -r
    if (options.remove) {
        process.stdout.write('Removing your config completely');
        fs.removeSync(configFilepath);
        displayCheckbox('green');
        process.exit(0);
    }

    // gas config -i
    if (options.import) {
        process.stdout.write(`Importing your config from '${optionalPath}'`);

        let config = fs.readFileSync(optionalPath, 'utf8');
        if (!config) {
            config = {};
        }

        // Overwrite current config
        createConfigFile(config);
        displayCheckbox('green');
        process.exit(0);
    }

    // gas config -e
    if (options.export) {
        // Read content of the global config file
        let config = fs.readFileSync(configFilepath, 'utf8');

        if (!config) {
            config = '{}';
        }

        // Create file or print output
        if (optionalPath) {
            process.stdout.write(`Exporting your config to '${optionalPath}'`);

            // Create a file in the specified location
            const file = {
                name: path.join(optionalPath, 'google-apps-script-config.json'),
                source: config,
            };
            createFile(file);
            displayCheckbox('green');
        } else {
            console.log(config);
        }
    }

    // gas config
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
                    rl.question(`Enter your 'Client secret' of your client\n > `, (input) => {
                        config.client.secret = input;
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
};
