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
 * @param {String} dependencyName - name of the dependency
 * @param {Object} dependencies - dependencies of the dependency
 * @returns {String} Processed code
 */
function processSource(code, dependencyName, dependencies) {
    // Replace function declarations
    code = code.replace(/^[ ]*function[ ]*([A-z]*)[ ]*\(/g, `function ${dependencyName}_$1(`);

    // TODO replace fuctnion calls to dependencies

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

    createFile({
        name: path.join(includeFolder, 'content.json'),
        source: JSON.stringify(dependencyList),
    });

    // Extensions
    const extensions = eaft.getCodeExtensions();
    // create list of new dependencies to download
    // create list of dependencies to remove
    for (const dependency of Reflect.ownKeys(dependencyList)) {
        var underscore = dependency.indexOf('_');

        const package = dependency.substring(0, underscore);
        const version = dependency.substring(underscore + 1);

        let dependencyName = dependency;

        // Use package name as dependency if it is a root dependency
        if (dependencyList[dependency].isRootDependency) {
            dependencyName = package;
        }

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
            const source = processSource(file.source, dependencyName, dependency);
            createFile({
                name: path.join(includeFolder, dependencyName, fileName),
                source,
            });
        }
    }
}

module.exports = downloadDependencies;
