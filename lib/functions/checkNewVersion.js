const fs = require('fs');
const pjson = require('../../package.json');
const request = require('request');

/**
 * Check if you have the latest version and show a short messege if that is not the case
 *
 * @param {callback} callback The callback to indicate we are finished.
 * @returns {Promise} A promise resolving no value
 */
function checkNewVersion(callback) {
    return new Promise((resolve, reject) => {
        request('https://gas-include.firebaseio.com/version/cli/latest.json', (error, response, body) => {
            // console.log(response.statuscode);
            // console.log(body);
            // console.log(pjson.version);
            const latestVersion = JSON.parse(body);
            if (latestVersion != pjson.version) {
                console.log(`${pjson.version} => ${latestVersion}`)
            }
            resolve();
        });
    });
}

module.exports = checkNewVersion;
