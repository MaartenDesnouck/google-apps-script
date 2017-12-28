const fs = require('fs-extra');
const colors = require('colors');
const request = require('request-promise');
const path = require('path');
const check = require('syntax-error');

const constants = require('../constants.js');
const pjson = require('../../package.json');

const getProjectRoot = require('./getProjectRoot.js');
const authenticate = require('./authenticate.js');
const getUserInfo = require('./getUserInfo.js');

/**
 * Log error
 *
 * @param {Object} err - The error to log.
 * @param {String} origin - origion of the error
 * @returns {void}
 */
async function log(err) {
    const requestData = {
        version: pjson.version,
        err: JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err))),
        timestamp: {
            ".sv": "timestamp",
        },
    };

    const result = await request({
        url: `${constants.FIREBASE_DATABASE_URL}/logs/errors.json`,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: requestData,
    });
    console.log(`Error logged: ${result.name}`);
    return;
}

/**
 * Handle error
 *
 * @param {Object} err - The error to log.
 * @returns {void}
 */
async function handle(err) {
    await log(err);

    switch (err.origin) {
        case 'green':
            break;
        default:
            break;
    }
    return;
}

module.exports = {
    log,
    handle,
};
