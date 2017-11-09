const fs = require('fs-extra');
const path = require('path');
var readline = require('readline');
const constants = require('./constants.js');
const displayCheckbox = require('./functions/displayCheckbox.js');
const createFile = require('./functions/createFile.js');

const configFilepath = path.join(constants.GLOBAL_DIR, constants.GLOBAL_CONFIG);

/**
 * Create a config file based on the values provided
 *
 * @returns {void}
 */
function createConfigFile(config) {
    createFile({
        name: configFilepath,
        source: config
    });
}

/**
 * Configure the tool with some settings
 *
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
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Q1: ', function (input) {
        config.test = input;
        rl.question('Q2: ', function (input) {
            config.derp = input;
            rl.question('Q3: ', function (input) {
                config.wa = input;
                console.log(config);
                rl.close();
            });
        });
    });



    //console.log('dialog');
    //createConfigFile();
};
