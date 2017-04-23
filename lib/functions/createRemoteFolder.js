var google = require('googleapis');

module.exports = function create() {
    authenticate(create_folder);
}

/**
 * Create a new folder in Google Drive
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 */
function createRemoteFolder(auth) {
    var fileMetadata = {
        'name': 'Invoices',
        'mimeType': 'application/vnd.google-apps.folder'
    };
    var drive = google.drive('v3');
    drive.files.create({
        auth: auth,
        resource: fileMetadata,
        fields: 'id'
    }, function(err, file) {
        if (err) {
            console.log(err);
        } else {
            console.log('Folder Id: ', file.id);
        }
    });
}

module.exports = createRemoteFolder;
