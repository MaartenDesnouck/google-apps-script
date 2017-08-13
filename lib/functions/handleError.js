const fs = require('fs-extra');
const colors = require('colors');
const request = require('request');
const path = require('path');
const constants = require('../constants.js');
const pjson = require('../../package.json');
const check = require('syntax-error');
const getAllFiles = require('./getAllFiles.js');
const displayCheckbox = require('./displayCheckbox.js');
const getProjectRoot = require('./getProjectRoot.js');
const authenticate = require('./authenticate.js');
const getUserInfo = require('./getUserInfo.js');
const checkNewVersion = require('./checkNewVersion.js');

/**
 * Log error
 *
 * @param {string} err - The error to log.
 * @param {string} extraInfo - Extra info about the error.
 * @returns {void}
 */
function logError(error, extraInfo) {
    const requestData = {
        version: pjson.version,
        extraInfo,
        error,
    };

    request({
        url: 'https://gas-include.firebaseio.com/logs/errors.json',
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: requestData,
    }, (error, response, body) => {});
}

/**
 * Handle error in an appropriate hanner
 *
 * @param {string} err - The error to handle.
 * @param {bool} shouldDisplayCheckbox - If we need to print a checkbox.
 * @returns {void}
 */
function handleError(err, shouldDisplayCheckbox) {
    if (err.displayCheckbox !== false && shouldDisplayCheckbox) {
        displayCheckbox('red');
    }

    let extraInfo;
    if (err && err.output === false) {
        logError(err, extraInfo);
    } else if (err && err.code === 401) {
        console.log(`Your credentials appear to be invalid [${`✘`.red}]\n`);
        console.log('Run \'gas auth -f\' to re-authenticate.');
        extraInfo = `Invalid Credentials`;
        logError(err, extraInfo);
    } else if (err === `Error: invalid_grant`) {
        console.log(`Your credentials appear to be invalid [${`✘`.red}]\n`);
        console.log(`Run 'gas auth -f' to re-authenticate.`);
        extraInfo = `Invalid Grant`;
        logError(err, extraInfo);
    } else if (err && err.code === `ENOENT` && err.path === `.gas/ID`) {
        console.log(`There appears to be no project linked to this folder [${`✘`.red}]\n`);
        console.log(`Navigate to a project folder or execute 'gas new <name>'`);
        console.log(`'gas clone <projectId>' or 'gas link <projectId>' to get started`);
        extraInfo = `No project found`;
        logError(err, extraInfo);
    } else if (err && err.code === `ENOTFOUND`) {
        console.log(`Can't seem to reach the Google servers [${`✘`.red}]`);
        extraInfo = `No connection`;
        logError(err, extraInfo);
    } else if (err && err.code === 400) {
        getProjectRoot('.').then((value) => {
            if (value.found) {
                console.log(`The code you are trying to push appears to have 1 or more syntax error(s). Push was reverted [${`✘`.red}]`);
                const files = getAllFiles(value.folder, '.', []);
                const syntaxErrors = [];
                for (const file of files) {
                    const extension = path.parse(file).ext;
                    if (extension === '.js' || extension === '.html') {
                        const src = fs.readFileSync(path.join(value.folder, file));
                        const syntaxErr = check(src, file);
                        if (syntaxErr) {
                            console.log(`----------------------------------------------------------------------------------------`);
                            console.error(syntaxErr);
                            syntaxErrors.push(syntaxErr);
                        }
                    }
                }
                extraInfo = `Syntax error: ${syntaxErrors}`;
            } else {
                console.log(`Something is wrong with the code you are trying to push, not sure what... Push was reverted. [${`✘`.red}]`);
                extraInfo = `Syntax error + unsure`;
            }
            logError(err, extraInfo);
        }).catch((err) => {
            console.log(err);
            extraInfo = `Syntax error + no rootFolder`;
            logError('err', extraInfo);
        });
    } else if (err) {
        console.log(`gas returned an error: ${err} [${`✘`.red}]`);
        logError(err, extraInfo);
    } else {
        console.log(`O-oh. Something seems to have gone wrong [${`✘`.red}]`);
        logError('No error', extraInfo);
    }
    return;
}

module.exports = handleError;
