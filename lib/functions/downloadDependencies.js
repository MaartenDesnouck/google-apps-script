const fs = require('fs-extra');
const path = require('path');
const request = require('request-promise');

const constants = require('../constants.js');
const createFile = require('./createFile.js');
const eaft = require('./extensionAndFiletype.js');

/**
 * Process all function declarations and calls to use the libraries 
 *
 * @param {String} code - Code to process
 * @param {Object} dependencyList - all dependencies
 * @param {String} depedencyName - name of the dependency
 * @returns {String} Processed code
 */
function processSource(code, dependencyList, depedencyName) {
    // Replace function declarations
    const packageName = dependencyList[depedencyName].packageName;
    code = code.replace(/(\s*)function\s([A-z]*)\s*\(*/g, `$1function ${packageName}_$2(`);

    // TODO replace function calls to dependencies
    const dependencies = dependencyList[depedencyName].dependencies;
    if (dependencies) {
        for (const dependency of Reflect.ownKeys(dependencies)) {
            const oldPrefix = dependencyList[dependency].packageName;
            console.log(oldPrefix);
            var re = new RegExp(`[ ]*${oldPrefix}_([A-z]*)[ ]*\\(`, "g");
            code = code.replace(re, ` ${dependency}_$1(`);
        }
    }
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
    fs.removeSync(includeFolder);
    const contentPath = path.join(includeFolder, 'content.json');

    // Create new content.json
    createFile({
        name: contentPath,
        source: JSON.stringify(dependencyList),
    });

    // Extensions
    const extensions = eaft.getCodeExtensions();

    // Download new dependencies
    for (const dependency of Reflect.ownKeys(dependencyList)) {
        const dependencies = dependencyList[dependency].dependencies;
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
        const packagePath = path.join(includeFolder, dependencyName);

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

        // Write library files
        for (const file of library.files) {
            const extension = eaft.getExtensionFromFiletype(file.type, extensions);
            const fileName = `${file.name}${extension}`;
            const source = processSource(file.source, dependencyList, dependency);
            createFile({
                name: path.join(packagePath, fileName),
                source,
            });
        }
    }
}

module.exports = downloadDependencies;
