const {
    google,
} = require('googleapis');
const constants = require('../constants.js');
const triageGoogleError = require('./triageGoogleError.js');

const files = {
    "files": [{
        "name": "appsscript",
        "type": "JSON",
        "source": "{\n  \"timeZone\": \"America/New_York\",\n  \"dependencies\": {\n  },\n  \"exceptionLogging\": \"STACKDRIVER\"\n}",
    }, {
        "name": "Code",
        "type": "SERVER_JS",
        "source": "function myFunction() {\n  \n}\n",
    }, ],
};

/**
 * Create a new remote script file
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @param {String} name - Name to give to the new Google Apps Script file.
 * @returns {Promise} - A promise resolving the metadata of the newly created project
 */
function remoteCreateProject(auth, name) {
    return new Promise((resolve, reject) => {
        const drive = google.drive('v3');
        const options = {
            auth,
            resource: {
                name,
                mimeType: constants.MIME_GAS_JSON,
            },
            media: {
                mimeType: constants.MIME_GAS_JSON,
                body: JSON.stringify(files),
            },
        };

        drive.files.create(options, (err, result) => {
            if (err) {
                triageGoogleError(err, 'remoteCreateProject').then((triaged) => {
                    reject(triaged);
                }).catch((notTriaged) => {
                    reject(notTriaged);
                });
            } else {
                resolve(result.data);
                return;
            }
            return;
        });
    });
}

module.exports = remoteCreateProject;
