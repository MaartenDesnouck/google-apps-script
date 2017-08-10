const fs = require('fs-extra');
const pjson = require('../../package.json');
const request = require('request');
const colors = require('colors');
const path = require('path');
const constants = require('../constants.js');
const createFile = require('./createFile.js');

/**
 * Check if you have the latest version and show a short messege if that is not the case
 *
 * @returns {Promise} - A promise resolving no value
 */
function checkNewVersion() {
    return new Promise((resolve, reject) => {
        const file = path.join(constants.APP_DIR, constants.INFO_FILE);

        // If it does not exist, write it.
        if (!fs.existsSync(file)) {
            createFile({
                name: file,
                source: `{"lastCheckForUpdate": 0}`,
            });
        }

        fs.readFile(file, 'utf8', (err, content) => {
            // Don't handle error
            if (err) {
                resolve();
                return;
            }

            // Read lastCheckForUpdate
            const json = JSON.parse(content);
            const lastCheckForUpdate = json.lastCheckForUpdate;

            // Show update message
            if (lastCheckForUpdate + (6 * 3600 * 1000) < Date.now()) {
                request('https://gas-include.firebaseio.com/version/cli/latest.json', (error, response, body) => {
                    const latestVersion = JSON.parse(body);
                    if (latestVersion && response.statusCode) {
                        const scale = pjson.version.length + latestVersion.length - 10;
                        if (response.statusCode === 200 && latestVersion !== pjson.version) {
                            console.log();
                            console.log(`${`   ┏`.yellow}${`-`.repeat(scale + 45).yellow}${`┓`.yellow}`);
                            console.log(`${`   |`.yellow}${` `.repeat(scale + 45)}${`|`.yellow}`);
                            console.log(`${`   |`.yellow}${`      Update available ${pjson.version} -> `}${`${latestVersion}`.green}${`        |`.yellow}`);
                            console.log(`${`   |`.yellow}${`  Run `}${`npm i -g google-apps-script`.blue}${` to update`}${` `.repeat(scale + 2)}${`|`.yellow}`);
                            console.log(`${`   |`.yellow}${` `.repeat(scale + 45)}${`|`.yellow}`);
                            console.log(`${`   ┗`.yellow}${`-`.repeat(scale + 45).yellow}${`┛`.yellow}`);
                            console.log();
                        }
                    }
                    resolve();
                    return;
                });
            } else {
                resolve();
                return;
            }

            // Update lastCheckForUpdate
            json.lastCheckForUpdate = Date.now();
            createFile({
                name: file,
                source: JSON.stringify(json),
            });
        });
    });
}

module.exports = checkNewVersion;
