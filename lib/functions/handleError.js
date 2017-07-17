const fs = require('fs');
const colors = require('colors');
const request = require('request');
const getUserInfo = require('./getUserInfo.js');
const constants = require('../constants.js');
const pjson = require('../../package.json');
const check = require('syntax-error');
const getAllFiles = require('./getAllFiles.js');
const printCheckbox = require('./printCheckbox.js');

/**
 * Log error
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {string} err - The error to log.
 * @returns {void}
 */
function logError(auth, err) {
    getUserInfo(auth, (userInfoErr, userInfo) => {
        const requestData = {
            version: pjson.version,
            message: err,
            user: userInfo,
        };

        request({
            url: 'https://gas-include.firebaseio.com/logs/errors.json',
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: requestData,
        });
    });
}

/**
 * Handle error in an appropriate hanner
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {string} err - The error to handle.
 * @param {bool} shouldPrintCheckbox - If we need to print a checkbox.
 * @returns {void}
 */
function handleError(auth, err, shouldPrintCheckbox) {
    if (shouldPrintCheckbox) {
        printCheckbox('red');
    }
    if (err.output === false) {
        // Do nothing
    } else if (err === 'Error: Invalid Credentials') {
        console.log(`${'✘'.red} Your credentials appear to be invalid.`);
        console.log('Run \'gas auth -f\' to re-authenicate.');
    } else if (err === 'Error: invalid_grant') {
        console.log(`${'✘'.red} Your credentials appear to be invalid.`);
        console.log('Run \'gas auth -f\' to re-authenticate.');
    } else if (err.code === 'ENOENT' && err.path === '.gas/ID') {
        console.log(`${'✘'.red} There appears to be no project linked to this folder. \n
            Navigate to a project folder or execute \'gas new <name>\',
            \'gas clone <fileId>\' or \'gas link <fileId>\' to get started.`);
    } else if (err.code === 400) {
        console.log('The code you are trying to push appears to have 1 or more syntax error(s). Push was reverted.');
        const files = getAllFiles('.');
        for (const file of files) {
            const extension = file.split('.').reverse()[0];
            if (extension === 'js' || extension === 'html') {
                const src = fs.readFileSync(file);
                const syntaxErr = check(src, file);
                if (syntaxErr) {
                    console.log(`----------------------------------------------------------------------------------------`)
                    console.error(syntaxErr);
                }
            }
        }
    } else {
        console.log(`gas returned an error: ${err}`);
    }
    logError(auth, err);
    return;
}

module.exports = handleError;
