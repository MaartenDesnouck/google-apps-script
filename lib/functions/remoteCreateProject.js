const google = require('googleapis');
const fs = require('fs-extra');
const constants = require('../constants.js');
const triageGoogleError = require('./triageGoogleError.js');

const files = [{
    "name": "appsscript",
    "type": "JSON",
    "source": "{\n  \"timeZone\": \"America/New_York\",\n  \"dependencies\": {\n  },\n  \"exceptionLogging\": \"STACKDRIVER\"\n}"
}, {
    "name": "Code",
    "type": "SERVER_JS",
    "source": "function myFunction() {\n  \n}\n"
}];

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

        script.projects.create(options, (err, result1) => {
            if (err) {
                triageGoogleError(err, 'remoteCreateProject').then((triaged) => {
                    reject(triaged);
                }).catch((notTriaged) => {
                    reject(notTriaged);
                });
            } else {
                const scriptId = result1.scriptId;
                script.projects.updateContent({
                    auth,
                    scriptId,
                    resource: {
                        files,
                    },
                }, (err, result2) => {
                    if (err) {
                        triageGoogleError(err, 'pushToRemote').then((triaged) => {
                            reject(triaged);
                        }).catch((notTriaged) => {
                            reject(notTriaged);
                        });
                    } else {
                        resolve(result1.data);
                    }
                    return;
                });
            }
            return;
        });
    });
}

module.exports = remoteCreateProject;
