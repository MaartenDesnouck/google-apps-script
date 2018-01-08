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
 * @returns {string} FolderPaht where we have stored the gas-inlcude.json file
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

    url = `${constants.FIREBASE_DATABASE_URL}/package/${dependency}/versions.json`;
    const versions = await request({
        url,
        method: "GET",
        json: true,
        headers: {
            "content-type": "application/json",
        },
    });

    if (versions) {
        console.log(Reflect.ownKeys(versions));

        // TODO translate versions
        // find bigest (maxSatisfying(versions, range)) maybe
        gasInclude.dependencies[dependency] = '^1.0.0';

        createFile({
            name: path.join(includeFile.folder, constants.INCLUDE_FILE),
            source: JSON.stringify(gasInclude),
        });

        console.log(gasInclude);
        console.log(includeFile.folder);
        return includeFile.folder;
    } else {
        throw {
            message: `Can't seem to find '${dependency}' in gas-include. Please double check your input.`,
            print: true,
        };;
    }

}

module.exports = saveDependencies;
