const request = require('request-promise');
const firebase = require('firebase');
const constants = require('../constants.js');
const pjson = require('../../package.json');
const firebaseJs = require('./firebase.js');

/**
 * Log error
 *
 * @param {Object} err - The error to log.
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @returns {void}
 */
async function log(err, auth) {
    if (err.print) {
        console.log(err.message);
    }

    try {
        err = JSON.parse(JSON.stringify(err, Reflect.ownKeys(err)));
    } catch (error) {
        err = err;
    }

    let userId = 'unknown';
    try {
        await firebaseJs.authWithFirebase(auth);
        userId = firebase.auth().currentUser.uid;
    } catch (error) {}

    try {
        let version = 'unkown';
        if (pjson.version) {
            version = pjson.version.replace(/\./g, '_');
        }

        const requestData = {
            userId,
            version,
            err,
            timestamp: {
                ".sv": "timestamp",
            },
        };

        const result = await request({
            url: `${constants.FIREBASE_DATABASE_URL}/logs/errors/${version}/${userId}.json`,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: requestData,
        });
        // console.log(`Error logged: ${result.name}`);
    } catch (error) {}
    return;
}

module.exports = {
    log,
};
