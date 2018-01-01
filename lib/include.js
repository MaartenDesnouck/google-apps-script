const readline = require('readline');

const constants = require('./constants.js');

const authenticate = require('./functions/authenticate.js');
const resolveDependencies = require('./functions/resolveDependencies.js');
const downloadDependencies = require('./functions/downloadDependencies.js');
const findInProject = require('./functions/findInProject.js');
const error = require('./functions/error.js');
const getId = require('./functions/getId.js');
const checkbox = require('./functions/checkbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Download included Google Apps Script files to includeDir folder
 *
 * @param {Object} options - Extra options.
 * @returns {void}
 */
module.exports = async(options) => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        process.stdout.write(`Including libaries...\n`);
        auth = await authenticate([]);
        const includeFile = await findInProject('.', constants.INCLUDE_FILE);

        if (!includeFile.found) {
            throw {
                message: `Can't seem to find a gas-include.json file.`, // TODO expand this message
                print: true,
            };
        }

        if (options.save) {
            // TODO
            console.log('\nsave option added');
        }

        process.stdout.write(`  Resolving dependencies...`);
        const dependencyList = await resolveDependencies(includeFile.folder);
        checkbox.display('green');

        process.stdout.write(`  Downloading libraries... `);
        const downloaded = await downloadDependencies(includeFile.folder, dependencyList);
        checkbox.display('green');
        process.exit(0);
    } catch (err) {
        checkbox.display('red');
        await error.log(err, auth);
        process.exit(1);
    }
};
