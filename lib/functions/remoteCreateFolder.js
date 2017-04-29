var google = require('googleapis');
var constants - require('../constants.js');

module.exports = function create() {
    authenticate(create_folder);
}

/**
 * Create a new folder in Google Drive
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 */
function remoteCreateFolder(auth) {
    var drive = google.drive('v3');
    drive.files.create({
        auth: auth,
        resource: {
            name: name,
            mimeType: constants.MIME_GAF
        },
        fields: 'id'
    }, function(err, file) {
        if (err) {
            console.log(err);
        } else {
            console.log('Folder Id: ', file.id);
        }
    });
}

module.exports = remoteCreateFolder;
