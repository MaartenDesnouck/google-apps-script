const fs = require('fs-extra');
const path = require('path');
const constants = require('./constants.js');
const displayCheckbox = require('./functions/displayCheckbox.js');
const createFile = require('./functions/createFile.js');

const configFilepath = path.join(constants.GLOBAL_DIR, constants.GLOBAL_CONFIG);

/**
 * Create a config file based on the values provided
 *
 * @returns {void}
 */
function createConfigFile(config) {}

/**
 * Configure the tool with some settings
 *
 * @param {string} options - Extra options.
 * @returns {void}
 */
module.exports = (optionalPath, options) => {
    const config = {};

    if (options.remove) {
        process.stdout.write('Removing your config completely');
        fs.removeSync(configFilepath);
        displayCheckbox('green');
    } else if (options.import) {
        process.stdout.write(`Importing your config from '${optionalPath}'`);

        let config = fs.readJsonSync(optionalPath, 'utf8');
        if (!config) {
            config = {};
        }

        // Overwrite current config
        createConfigFile(config);
        displayCheckbox('green');
    } else if (options.export) {
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
            console.log(source);
        }
    } else {
        let config = {};
        // lets display a dialog to get all the values in
        // create the file 

        console.log('dialog');
        createConfigFile();
    }
    process.exit(0);
};
