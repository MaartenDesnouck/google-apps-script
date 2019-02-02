const fs = require('fs-extra');
const request = require('request-promise');
const colors = require('colors');
const path = require('path');
const error = require('./error.js');
const constants = require('../constants.js');
const createFile = require('./createFile.js');
const pjson = require('../../package.json');

/**
 * Check if you have the latest version and show a short message if that is not the case
 *
 * @returns {Boolean} - A boolean indicating if we printed an update available indicator
 */
async function checkNewVersion() {
    try {
        const file = path.join(constants.GLOBAL_DIR, constants.GLOBAL_INFO);

        // If it does not exist, create it.
        if (!fs.existsSync(file)) {
            createFile({
                name: file,
                source: `{"lastCheckForUpdate": 0}\n`,
            });
        }

        // Read info file
        const json = fs.readJsonSync(file, 'utf8');
        const lastCheckForUpdate = json.lastCheckForUpdate;

        // Show update message
        if (lastCheckForUpdate + (6 * 3600 * 1000) < Date.now()) {
            const latestVersion = await request(`${constants.FIREBASE_DATABASE_URL}/version/cli/latest.json`);
            if (latestVersion && latestVersion !== 'null' && latestVersion !== `"${pjson.version}"`) {
                const scale = pjson.version.length + latestVersion.length - 10;

                console.log();
                console.log(`${`   ┏`.yellow}${`─`.repeat(scale + 45).yellow}${`┓`.yellow}`);
                console.log(`${`   │`.yellow}${` `.repeat(scale + 45)}${`│`.yellow}`);
                console.log(`${`   │`.yellow}${`      Update available ${pjson.version} -> `}${`${latestVersion}`.green}${`        │`.yellow}`);
                console.log(`${`   │`.yellow}${`  Run `}${`npm i -g google-apps-script`.red}${` to update`}${` `.repeat(scale + 2)}${`│`.yellow}`);
                console.log(`${`   │`.yellow}${` `.repeat(scale + 45)}${`│`.yellow}`);
                console.log(`${`   ┗`.yellow}${`─`.repeat(scale + 45).yellow}${`┛`.yellow}`);
                console.log();
            }

            // Update lastCheckForUpdate
            json.lastCheckForUpdate = Date.now();
            createFile({
                name: file,
                source: JSON.stringify(json),
            });
            return true;
        }
        return false;
    } catch (err) {
        err.origin = 'checkNewVersion';
        await error.log(err);
        return false;
    }
}

module.exports = checkNewVersion;
