const fs = require('fs');
const pjson = require('../../package.json');
const request = require('request');
const colors = require('colors');

/**
 * Check if you have the latest version and show a short messege if that is not the case
 *
 * @param {callback} callback The callback to indicate we are finished.
 * @returns {Promise} - A promise resolving no value
 */
function checkNewVersion(callback) {
    return new Promise((resolve, reject) => {
        request('https://gas-include.firebaseio.com/version/cli/latest.json', (error, response, body) => {
            // console.log(response.statusCode);
            // console.log(body);

            const latestVersion = JSON.parse(body);
            const scale = pjson.version.length + latestVersion.length - 10;
            if (response.statusCode == 200 && latestVersion !== pjson.version) {
                console.log();
                console.log(`   ┏`.yellow + `-`.repeat(scale + 45).yellow + `┓`.yellow);
                console.log(`   |`.yellow + ` `.repeat(scale + 45) + `|`.yellow);
                console.log(`   |`.yellow + `      Update available ` + `${pjson.version}` + ` -> ` + `${latestVersion}`.green + `        |`.yellow);
                console.log(`   |`.yellow + `  Run ` + `npm i -g google-apps-script`.blue + ` to update` + ` `.repeat(scale + 2) + `|`.yellow);
                console.log(`   |`.yellow + ` `.repeat(scale + 45) + `|`.yellow);
                console.log(`   ┗`.yellow + `-`.repeat(scale + 45).yellow + `┛`.yellow);
                console.log();
            }
            resolve();
        });
    });
}

module.exports = checkNewVersion;
