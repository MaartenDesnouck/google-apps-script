const fs = require('fs-extra');
const path = require('path');
const request = require('request-promise');

const constants = require('../constants.js');
const createFile = require('./createFile.js');
const eaft = require('./extensionAndFiletype.js');
const getAllFolders = require('./getAllFolders.js');


/**
 * Process all function declarations and calls to use the libraries 
 *
 * @param {String} code - Code to process
 * @param {String} dependencyName - name of the dependency
 * @param {Object} dependencies - dependencies of the dependency
 * @returns {String} Processed code
 */
function processSource(code, dependencyName, dependencies) {
    // Replace function declarations
    code = code.replace(/^[ ]*function[ ]*([A-z]*)[ ]*\(/g, `function ${dependencyName}_$1(`);

    // TODO replace function calls to dependencies

    return code;
}

/**
 * Download all necessary dependencies 
 *
 * @param {String} rootFolder - Folder where we will create the gas-include folder
 * @param {Object} dependencyList - List of exact dependencies that we need to download 
 * @returns {void}
 */
async function downloadDependencies(rootFolder, dependencyList) {
    const includeFolder = path.join(rootFolder, constants.INCLUDE_DIR);
    const contentPath = path.join(includeFolder, 'content.json');

    // List of folders 
    const oldFolders = getAllFolders(includeFolder, [], false, false);
    const newFolders = [];

    // Read current state of the gas-include folder
    let oldPackages = {};
    if (fs.existsSync(contentPath)) {
        oldPackages = fs.readJsonSync(contentPath);
    }

    // Create new content.json
    createFile({
        name: contentPath,
        source: JSON.stringify(dependencyList),
    });

    // Extensions
    const extensions = eaft.getCodeExtensions();

    // Download new dependencies
    for (const dependency of Reflect.ownKeys(dependencyList)) {
        const package = dependencyList[dependency].packageName;
        const version = dependencyList[dependency].version;
        const isRootDependency = dependencyList[dependency].isRootDependency;

        // Use package name as dependency if it is a root dependency
        let dependencyName;
        if (isRootDependency) {
            dependencyName = package;
        } else {
            dependencyName = dependency;
        }
        oldFolders.pop(dependencyName);
        const packagePath = path.join(includeFolder, dependencyName);

        // Determine if package needs download
        let needsDownload = false
        if (!fs.existsSync(packagePath)) {
            needsDownload = true;
        } else if (isRootDependency && fs.existsSync(packagePath)) {
            if (!oldPackages[dependency] || oldPackages[dependency].version !== version) {
                needsDownload = true;
            }
        }

        // Do download
        if (needsDownload) {
            // Get library code
            url = `${constants.FIREBASE_DATABASE_URL}/package/${package}/version/${version}/code.json`;
            const library = await request({
                url,
                method: "GET",
                json: true,
                headers: {
                    "content-type": "application/json",
                },
            });

            // Remove packagefolder if it exists already
            if (fs.existsSync(packagePath)) {
                fs.removeSync(packagePath);
            }

            // Write library files
            for (const file of library.files) {
                const extension = eaft.getExtensionFromFiletype(file.type, extensions);
                const fileName = `${file.name}${extension}`;
                const source = processSource(file.source, dependencyName, dependency);
                createFile({
                    name: path.join(packagePath, fileName),
                    source,
                });
            }
        }
    }

    // Remove extra folders
    for (const oldFolder of oldFolders) {
        fs.removeSync(path.join(includeFolder, oldFolder));
    }

}

module.exports = downloadDependencies;
