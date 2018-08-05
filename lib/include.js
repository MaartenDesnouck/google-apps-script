const constants = require('./constants.js');
const authenticate = require('./functions/authenticate.js');
const resolveDependencies = require('./functions/resolveDependencies.js');
const downloadDependencies = require('./functions/downloadDependencies.js');
const findInProject = require('./functions/findInProject.js');
const error = require('./functions/error.js');
const checkbox = require('./functions/checkbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const saveDependencies = require('./functions/saveDependencies.js');


/**
 * Download included Google Apps Script files to includeDir folder
 *
 * @param {Object} options - Extra options.
 * @returns {void}
 */
module.exports = async (options) => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        process.stdout.write(`Including libaries...`);
        auth = await authenticate([]);
        const includeFile = await findInProject('.', constants.INCLUDE_FILE);
        let projectRoot = {};

        if (!includeFile.found && !options.save) {
            throw {
                message: `Can't seem to find a gas-include.json file. Use 'gas init' to create one.`,
                print: true,
            };
        }

        if (!includeFile.found) {
            // Only need to find projectRoot if includefile is not found
            projectRoot = await findInProject('.', constants.META_DIR);
        }

        if (options.save) {
            includeFile.folder = await saveDependencies(options.save, includeFile, projectRoot);
            includeFile.found = true;
        }

        process.stdout.write(`\n  Resolving dependencies...`);
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
