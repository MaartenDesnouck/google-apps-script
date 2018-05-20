const {
    google,
} = require('googleapis');

/**
 * Log info about users
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @returns {Promise} - A promise resolving user info of the current user
 */
function getUserInfo(auth) {
    return new Promise((resolve, reject) => {
        const oauth2 = google.oauth2({
            auth,
            version: 'v2',
        });

        oauth2.userinfo.v2.me.get((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res.data);
            }
            return;
        });
    });
}

module.exports = getUserInfo;
