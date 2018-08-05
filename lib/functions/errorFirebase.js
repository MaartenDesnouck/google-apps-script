const request = require('request-promise');
const constants = require('../constants.js');
const pjson = require('../../package.json');

/**
 * Log error
 *
 * @param {Object} err - The error to log.
 * @param {String} origin - origion of the error
 * @returns {void}
 */
async function log(err) {
    try {
        err = JSON.parse(JSON.stringify(err, Reflect.ownKeys(err)));
    } catch (error) {
        err = err;
    }

    try {
        const requestData = {
            version: pjson.version,
            err,
            timestamp: {
                '.sv': 'timestamp',
            },
        };

        const result = await request({
            url: `${constants.FIREBASE_DATABASE_URL}/logs/errors.json`,
            method: 'POST',
            json: true,
            headers: {
                'content-type': 'application/json',
            },
            body: requestData,
        });
        console.log(`Error logged: ${result.name}`);
    } catch (error) {}
    return;
}

module.exports = {
    log,
};
