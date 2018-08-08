const check = require('syntax-error');
const path = require('path');
const fs = require('fs-extra');
const constants = require('../constants.js');
const getAllFiles = require('./getAllFiles.js');
const findInProject = require('./findInProject.js');

/**
 * Triage Google error
 *
 * @param {Object} err - The error to triage.
 * @param {String} origin - Origin of the error
 * @returns {Object} - Object with the error and extra info after triage
 */
async function triageGoogleError(err, origin) {
    // console.log(err);
    const triaged = {
        err,
        origin,
        print: true,
    };

    if (err && err.code === 401) {
        triaged.message = `Your credentials appear to be invalid.\nRun 'gas auth -f' to re-authenticate.`;
        triaged.extraInfo = `Invalid Credentials`;
    } else if (err === `Error: invalid_grant`) {
        triaged.message = `Your credentials appear to be invalid.\nRun 'gas auth -f' to re-authenticate.`;
        triaged.extraInfo = `Invalid Grant`;
    } else if (err && err.code === 403) {
        triaged.message = err.message;
        triaged.extraInfo = `Not allowed`;
    } else if (err && err.code === 404) {
        triaged.message = err.message;
        triaged.extraInfo = `Not found`;
    } else if (err && err.code === `ENOTFOUND`) {
        triaged.message = `Can't seem to reach the Google servers.`;
        triaged.extraInfo = `No connection`;
    } else if (err && err.code === `ECONNRESET`) {
        triaged.message = `Unexpected closed connection.`;
        triaged.extraInfo = `Closed connection`;
    } else if (err && err.code === 400 && origin === 'pushToRemote') {
        const projectRoot = await findInProject('.', constants.META_DIR);
        if (projectRoot.found) {

            // Find syntax errors in all files
            const files = getAllFiles(projectRoot.folder, '.', []);
            const syntaxErrors = [];
            for (const file of files) {
                const extension = path.parse(file).ext;
                if (extension === '.js' || extension === '.gs') {
                    const src = fs.readFileSync(path.join(projectRoot.folder, file));
                    const syntaxErr = check(src, file);
                    if (syntaxErr) {
                        syntaxErrors.push(syntaxErr);
                    }
                }
            }

            // Create a message with a summary of found syntax errors
            if (syntaxErrors.length > 0) {
                let message = `The code you are trying to push appears to have 1 or more syntax error(s).`;
                for (const err of syntaxErrors) {
                    message += `-------------------------------------------------------------------------------------------------\n`;
                    message += `${err}\n`;
                }
                triaged.extraInfo = `${syntaxErrors}`;
            } else {
                triaged.message = `Google doesn't accept the code you are trying to push. Try doublechecking for project structure errors.`;
                triaged.extraInfo = `No syntax errors`;
            }
        } else {
            triaged.message = `Google doesn't accept the code you are trying to push. Try doublechecking for project structure errors.`;
            triaged.extraInfo = `No .gas folder found`;
        }
    } else if (err) {
        triaged.message = (`gas returned an error: ${err}`);
        triaged.extraInfo = `Not a known error`;
    } else {
        triaged.message = (`O-oh. Something seems to have gone wrong.`);
        triaged.extraInfo = `No error passed to the function`;
    }
    return triaged;
}

module.exports = triageGoogleError;
