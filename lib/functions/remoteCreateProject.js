const google = require('googleapis');
const fs = require('fs-extra');
const constants = require('../constants.js');
const triageGoogleError = require('./triageGoogleError.js');

const content = `{'files': [{'name': 'main', 'type': 'server_js', 'source': 'function myFunction() {\n\n}'}]}`;

/**
 * Create a new script file in Google Drive
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {String} title - Name to give to the new Google Apps Script file.
 * @returns {Promise} - A promise resolving the metadata of the newly created project
 */
function remoteCreateProject(auth, title) {
    return new Promise((resolve, reject) => {
        const script = google.script('v1');
        const options = {
            auth,
            title,
        };

        script.projects.create(options, (err, result) => {
            if (err) {
                triageGoogleError(err, 'remoteCreateProject').then((triaged) => {
                    reject(triaged);
                }).catch((notTriaged) => {
                    reject(notTriaged);
                });
            } else {
                resolve(result);
            }
            return;
        });
    });
}

module.exports = remoteCreateProject;
