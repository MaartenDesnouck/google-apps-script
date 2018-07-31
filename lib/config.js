const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');
const constants = require('./constants.js');
const checkbox = require('./functions/checkbox.js');
const createFile = require('./functions/createFile.js');

const configFile = path.join(constants.GLOBAL_DIR, constants.GLOBAL_CONFIG);
const tokenFile = path.join(constants.GLOBAL_DIR, constants.GLOBAL_TOKEN);

/**
 * Create a config file based on the values provided
 *
 * @param {Object} config - The config to create
 * @returns {void}
 */
function createConfigFile(config) {
    createFile({
        name: configFile,
        source: `${JSON.stringify(config)}\n`,
    });
}

/**
 * Create a config file based on the values provided
 *
 * @param {String} success - Whether or not the dialog completed succesfully
 * @param {String} config - The config we created trough the dialog
 * @returns {void}
 */
function endDialog(success, config) {
    if (success) {
        createConfigFile(config);
        console.log();
        process.stdout.write('Succesfully configured gas');
        checkbox.display('green');
        process.exit(0);
    } else {
        console.log(`Only 'y' and 'n' are accepted inputs.`);
        process.stdout.write('Failed to configure gas');
        checkbox.display('red');
        process.exit(1);
    }
}

/**
 * Import a config file
 *
 * @param {String} optionalPath - The path where we will import the config from
 * @returns {void}
 */
function importConfig(optionalPath) {
    process.stdout.write(`Importing your config from '${optionalPath}'`);

    let config;
    try {
        config = fs.readJsonSync(optionalPath, 'utf8');
    } catch (err) {
        checkbox.display('red');
        process.stdout.write(`Can't seem to read '${optionalPath}'`);
        checkbox.display('red');
        process.exit(1);
    }

    fs.removeSync(tokenFile);

    // Overwrite current config
    createConfigFile(config);
    checkbox.display('green');
}

/**
 * Export a config file
 *
 * @param {String} optionalPath - The path where we will export the config to
 * @returns {void}
 */
function exportConfig(optionalPath) {
    // Read content of the global config file
    let config = fs.readFileSync(configFile, 'utf8');

    if (!config) {
        config = '{}';
    }

    // Create file or print output
    if (optionalPath) {
        process.stdout.write(`Exporting your config to '${optionalPath}'`);

        // Create a file in the specified location
        const file = {
            name: optionalPath,
            source: config,
        };
        createFile(file);
        checkbox.display('green');
    } else {
        console.log(config);
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

        rl.question(`Do you want to use a custom OAuth 2.0 client to authenticate with Google? [${'y'.green}/${'n'.red}]\n > `, (input) => {
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
 * Configure the tool with some settings
 *
 * @param {String} optionalPath - Either the path the a config file to import or the location to which we need to export the config
 * @param {String} options - Extra options.
 * @returns {void}
 */
module.exports = (optionalPath, options) => {
    // gas config -r
    if (options.reset) {
        process.stdout.write('Resetting config to default values...');
        fs.removeSync(tokenFile);
        endDialog(true, {});
        process.exit(0);
    }

    // gas config -i
    if (options.import) {
        if (optionalPath) {
            importConfig(optionalPath);
            process.exit(0);
        } else {
            process.stdout.write(`Please provide a config file to import`);
            checkbox.display('red');
            process.exit(1);
        }
    }

    // gas config -e
    if (options.export) {
        exportConfig(optionalPath);
        process.exit(0);
    }

    // gas config
    enterConfig();
};
