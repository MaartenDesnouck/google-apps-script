const fs = require('fs');
const colors = require('colors');
const request = require('request');
const constants = require('../constants.js');
const pjson = require('../../package.json');
const check = require('syntax-error');
const getAllFiles = require('./getAllFiles.js');
const displayCheckbox = require('./displayCheckbox.js');

/**
 * Log error
 *
 * @param {string} err - The error to log.
 * @returns {void}
 */
function logError(err) {
    const requestData = {
        version: pjson.version,
        message: err,
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
}

/**
 * Handle error in an appropriate hanner
 *
 * @param {string} err - The error to handle.
 * @param {bool} shoulddisplayCheckbox - If we need to print a checkbox.
 * @returns {void}
 */
function handleError(err, shoulddisplayCheckbox) {
    if (shoulddisplayCheckbox) {
        displayCheckbox('red');
    }
    if (err && err.output === false) {
        // Do nothing
    } else if (err === 'Error: Invalid Credentials') {
        console.log(`Your credentials appear to be invalid [${'✘'.red}]\n`);
        console.log('Run \'gas auth -f\' to re-authenicate.');
    } else if (err === 'Error: invalid_grant') {
        console.log(`Your credentials appear to be invalid [${'✘'.red}]\n`);
        console.log('Run \'gas auth -f\' to re-authenticate.');
    } else if (err && err.code === 'ENOENT' && err.path === '.gas/ID') {
        console.log(`There appears to be no project linked to this folder [${'✘'.red}]\n`);
        console.log(`Navigate to a project folder or execute 'gas new <name>'`);
        console.log(`'gas clone <fileId>' or 'gas link <fileId>' to get started.`);
    } else if (err && err.code === 400) {
        console.log(`The code you are trying to push appears to have 1 or more syntax error(s). Push was reverted. [${'✘'.red}]`);
        const files = getAllFiles('.');
        for (const file of files) {
            const extension = file.split('.').reverse()[0];
            if (extension === 'js' || extension === 'html') {
                const src = fs.readFileSync(file);
                const syntaxErr = check(src, file);
                if (syntaxErr) {
                    console.log(`----------------------------------------------------------------------------------------`);
                    console.error(syntaxErr);
                }
            }
        }
    } else if (err) {
        console.log(`gas returned an error: ${err} [${'✘'.red}]`);
    }
    logError(err);
    return;
}

module.exports = handleError;
