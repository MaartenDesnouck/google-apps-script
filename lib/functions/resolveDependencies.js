const fs = require('fs-extra');
const path = require('path');
const request = require('request-promise');
const semver = require('semver');

const constants = require('../constants.js');
const createFile = require('./createFile.js');


/**
 * Read the gas-include file a return a dependency tree with exact versions
 *
 * @returns {void}
 */
async function resolveDependencies(rootFolder) {
    const includeFile = path.join(rootFolder, constants.INCLUDE_FILE);
    const includeJson = fs.readJsonSync(includeFile, 'utf8');
    const exactVersionTree = await recDependencies(includeJson.dependencies);
    return exactVersionTree;
}

/**
 * Recursively resolve a set of dependencies to fixed versions
 *
 * @returns {void}
 */
async function recDependencies(dependencies) {
    let url;
    const result = {};
    // TODO think about doing this in paralel using promises
    // TODO think about converging the tree, sort of dynamic programming; we dont needto calculate nor include everything more than once
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
        const match = semver.maxSatisfying(Reflect.ownKeys(semverVersions), range);

        // Resolve new dependencies
        url = `${constants.FIREBASE_DATABASE_URL}/package/${dependency}/version/${match.replace(/\./g, '_')}/dependencies.json`;
        const newDependencies = await request({
            url,
            method: "GET",
            json: true,
            headers: {
                "content-type": "application/json",
            },
        });
        let recResult = {};
        if (newDependencies) {
            recResult = await recDependencies(newDependencies);
        }

        // Stitch everything together
        result[dependency] = {
            version: match,
            dependencies: recResult,
        }
    }
    return result;
}

module.exports = resolveDependencies;
