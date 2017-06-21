const google = require('googleapis');
const request = require('request');
const pjson = require('../../package.json');

/**
 * Log info about users
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 */
function logUserInfo(auth) {
    console.log('derp');
    var oauth2 = google.oauth2({
        auth: auth,
        version: 'v2'
    });

    oauth2.userinfo.v2.me.get(function(err, res) {
        if (res) {
            var requestData = {
                version: pjson.version,
                info: res
            }

            request({
                url: 'https://gas-powered.firebaseio.com/logs/auth.json',
                method: "POST",
                json: true,
                headers: {
                    "content-type": "application/json",
                },
                body: requestData
            });
        }
    });
}

module.exports = logUserInfo;
