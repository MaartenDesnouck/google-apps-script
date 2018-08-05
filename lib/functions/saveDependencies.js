const fs = require('fs-extra');
const path = require('path');
const request = require('request-promise');
const semver = require('semver');
const constants = require('../constants.js');
const createFile = require('./createFile.js');

/**
 * Save a dependency to the gas-include file
 *
 * @param {Object} dependency - Dedendencies to save
 * @param {Object} includeFile - Object indicating if and where the include file is
 * @param {Object} projectRoot - Object indicating if and where the .gas dir is
 * @returns {string} - FolderPath where we have stored the gas-inlcude.json file
 */
async function saveDependencies(dependency, includeFile, projectRoot) {
    let gasInclude = {};

    if (includeFile.found) {
        gasInclude = fs.readJsonSync(path.join(includeFile.folder, constants.INCLUDE_FILE));
    } else if (projectRoot.found) {
        includeFile.folder = projectRoot.folder;
    } else {
        includeFile.folder = '.';
    }

    if (!gasInclude.dependencies) {
        gasInclude.dependencies = {};
    }

    const url = `${constants.FIREBASE_DATABASE_URL}/package/${dependency}/versions.json`;
    const versions = await request({
        url,
        method: "GET",
        json: true,
        headers: {
            "content-type": "application/json",
        },
    });

    if (versions) {
        // Get highest version
        let maxVersion = '0.0.0';
        for (const version of Reflect.ownKeys(versions)) {
            const newVersion = version.replace(/_/g, '.');
            if (semver.gt(newVersion, maxVersion)) {
                maxVersion = newVersion;
            }
        }

        gasInclude.dependencies[dependency] = `^${maxVersion}`;

        createFile({
            name: path.join(includeFile.folder, constants.INCLUDE_FILE),
            source: JSON.stringify(gasInclude),
        });

        return includeFile.folder;
    } else {
        throw {
            message: `Can't seem to find '${dependency}' in gas-include. Please double check your input.`,
            print: true,
        };
    }

}

module.exports = saveDependencies;
