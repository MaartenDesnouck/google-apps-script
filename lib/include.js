const readline = require('readline');

const constants = require('./constants.js');

const authenticate = require('./functions/authenticate.js');
const resolveDependencies = require('./functions/resolveDependencies.js');
const findInProject = require('./functions/findInProject.js');
const error = require('./functions/error.js');
const getId = require('./functions/getId.js');
const checkbox = require('./functions/checkbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Download included Google Apps Script files to includeDir folder
 *
 * @returns {void}
 */
module.exports = async(options) => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        process.stdout.write(`Inlcuding libaries...`);
        auth = await authenticate([]);
        const includeFile = await findInProject('.', constants.INCLUDE_FILE);

        if (!includeFile.found) {
            throw {
                message: `Can't seem to find a gas-include.json file.`, //TODO expand this message
                print: true,
            };
        }

        if (options.save) {
            // TODO
            console.log('\nsave option added');
        }

        process.stdout.write(`  Resolving dependencies...`);
        const dependencyTree = await resolveDependencies(includeFile.folder);
        checkbox.display('green');
        console.log(dependencyTree);

        process.stdout.write(`  Downloading libraries...`);
        //const downloaded = await downloadDependencyTree(dependencyTree);
        checkbox.display('green');

        process.stdout.write(`  Linking libraries...`);
        // TODO
        checkbox.display('green');
        process.exit(0);

        // process.stdout.write(`${downloaded.successful.length} included file(s) were successfully updated`);
        // checkbox.display('green');
        // if (downloaded.failed.length > 0) {
        //     checkbox.display('red');
        //     process.stdout.write(`${downloaded.failed.length} included file(s) failed, doublecheck if their url(s) are correct and retry`);
        //     checkbox.display('red');
        //     for (const fail of downloaded.failed) {
        //         process.stdout.write(`   - ${fail}\n`);
        //     }
        // }
        process.exit(0);
    } catch (err) {
        checkbox.display('red');
        await error.log(err, auth);
        process.exit(1);
    }
};
