const fs = require('fs-extra');
const path = require('path');
const request = require('request-promise');
const semver = require('semver');
const constants = require('../constants.js');

const depencyList = {};

/**
 * Recursively resolve a set of dependencies to fixed versions
 *
 * @param {Object} dependencies - Dedendencies with ranges to resolve
 * @param {Boolean} root - Boolean indicating if these are root dependencies
 * @returns {void}
 */
async function recDependencies(dependencies, root) {
    let url;

    // TODO think about doing this in parallel using promises

    for (const dependency of Reflect.ownKeys(dependencies)) {
        const range = dependencies[dependency];
        url = `${constants.FIREBASE_DATABASE_URL}/package/${dependency}/versions.json`;
        const versions = await request({
            url,
            method: "GET",
            json: true,
            headers: {
                "content-type": "application/json",
            },
        });

        // Translate db versions to semver versions
        const semverVersions = {};
        for (const version of Reflect.ownKeys(versions)) {
            semverVersions[version.replace(/_/g, '.')] = true;
        }
        const semverMatch = semver.maxSatisfying(Reflect.ownKeys(semverVersions), range);
        const match = semverMatch.replace(/\./g, '_');
        const versionKey = `${dependency}_${match}`;

        // Set result
        if (dependencies[dependency]) {
            Reflect.deleteProperty(dependencies, dependency);
        }
        dependencies[versionKey] = true;

        // check if in dependency list yet
        if (!depencyList[versionKey]) {
            // Resolve new dependencies
            url = `${constants.FIREBASE_DATABASE_URL}/package/${dependency}/version/${match}/dependencies.json`;
            const newDependencies = await request({
                url,
                method: "GET",
                json: true,
                headers: {
                    "content-type": "application/json",
                },
            });

            // Add to dependencyList
            depencyList[versionKey] = {};

            // Resolve new dependencies
            if (newDependencies) {
                depencyList[versionKey].dependencies = await recDependencies(newDependencies);
            }
        }

        if (root) {
            depencyList[versionKey].isRootDependency = true;
        }
        depencyList[versionKey].packageName = dependency;
        depencyList[versionKey].version = match;
    }
    return dependencies;
}

/**
 * Read the gas-include file a return a dependency tree with exact versions
 *
 * @param {String} rootFolder - Folder where we can find the gas-include file
 * @returns {void}
 */
async function resolveDependencies(rootFolder) {
    const includeFile = path.join(rootFolder, constants.INCLUDE_FILE);
    const includeJson = fs.readJsonSync(includeFile, 'utf8');
    await recDependencies(includeJson.dependencies, true);
    return depencyList;
}

module.exports = resolveDependencies;
