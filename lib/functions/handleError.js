var fs = require('fs');
var colors = require('colors');
var request = require('request');
var constants = require('../constants.js');
var pjson = require('../../package.json');

/**
 * Handle error in an appropriate hanner
 *
 * @param {err} string - The error to handle.
 */
function handleError(err) {
    if (err == 'HANDLED') {
        // Do nothing
        return;
    } else if (err == 'Error: Invalid Credentials') {
        console.log('✘'.red + ' Your credentials appear to be invalid.');
        console.log('Run \'gas auth -f\' to re-authenicate.');
    } else if (err == 'Error: invalid_grant') {
        console.log('✘'.red + ' Your credentials appear to be invalid.');
        console.log('Run \'gas auth -f\' to re-authenticate.');
    } else if (err.code == 'ENOENT' && err.path == '.gas/ID') {
        console.log('✘'.red + ' There appears to be no project linked to this folder. \n' +
            'Navigate to a project folder or execute \'gas new <name>\',' +
            ' \'gas clone <fileId>\' or \'gas link <fileId>\' to get started.');
    } else if (err.code == 'ENOENT' && err.path == './gas-include.js') {
        console.log('There appears to be no \'gas-include.js\' file in this folder.');
    } else {
        console.log('gas returned an error: ' + err);
    }
    logError(err);
}

module.exports = handleError;

/**
 * Log error
 *
 * @param {err} string - The error to log.
 */
function logError(err) {
    var requestData = {
        version: pjson.version,
        message: err
    }

    request({
        url: 'https://gas-include.firebaseio.com/logs/errors.json',
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: requestData
    });
}
