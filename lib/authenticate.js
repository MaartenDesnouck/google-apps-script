var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var open = require('open');
var color = require('colors');

var SCOPES = ['https://www.googleapis.com/auth/drive'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'google-apps-script-by-mdsnouck.json';
var CLIENT_ID = '835520708717-cp90h45vu3jdeedoi9i0j7vhlaklmdg2.apps.googleusercontent.com';
var CLIENT_SECRET = 'zZLJL0FlCAn_PzQpFV3wRLLM';
var REDIRECT_URL = 'urn:ietf:wg:oauth:2.0:oob';

module.exports = function derp() {
    //fs.unlink(TOKEN_PATH, function() {});
    authorize(checkAuth);
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(callback) {
    var clientSecret = CLIENT_SECRET;
    var clientId = CLIENT_ID;
    var redirectUrl = REDIRECT_URL;
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function(err, token) {
        if (err) {
            getNewToken(oauth2Client, callback);
        } else {
            oauth2Client.credentials = JSON.parse(token);
            callback(oauth2Client);
        }
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    open(authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log('A webbrowser should have opened, to authorize \'Google Apps Script by mdsnouck\'');
    rl.question('Please accept and enter the code from the page here: ', function(code) {
        rl.close();
        oauth2Client.getToken(code, function(err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            oauth2Client.credentials = token;
            storeToken(token);
            callback(oauth2Client);
        });
    });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the names and IDs of up to 1000 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
    var drive = google.drive('v3');
    drive.files.list({
        auth: auth,
        pageSize: 10,
        fields: "nextPageToken, files(id, name, parents, fullFileExtension)"
    }, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            console.log('Run \'GAS auth\' to re-authenicate.');
            return;
        }
        var files = response.files;
        if (files.length == 0) {
            console.log('No files found.');
        } else {
            console.log('%s', response.nextPageToken);
            console.log('%s Files:', files.length);
            var regex = '.*jpg';
            downloadFiles(auth, response.files, regex, 200, 0);
        }
    });
}

/**
 * Check if we can get files
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function checkAuth(auth) {
    var drive = google.drive('v3');
    drive.files.list({
        auth: auth,
    }, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            console.log('Run \'GAS auth\' to re-authenicate.');
            return;
        }
        console.log('Succesfully authenticated.'.green);
        listFiles(auth);
    });
}

/**
 * Download files in list
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {files} files List of files to download.
 * @param {string} regex Regular expression to match.
 * @param {int} interval Milliseconds between downloads to limit request rate.
 * @param {int} index Current index in the files list.
 */
function downloadFiles(auth, files, regex, interval, index) {
    var file = files[index];
    if ((file.fullFileExtension !== undefined) && (file.name.match(regex) != null)) {
        var fileId = file.id;
        var uri = 'downloads/' + file.name;
        var dest = fs.createWriteStream(uri);
        var drive = google.drive('v3');
        drive.files.get({
                auth: auth,
                fileId: fileId,
                alt: 'media'
            })
            .on('end', function() {
                console.log('Downloaded: %s', file.name);
            })
            .on('error', function(err) {
                console.log('Error during download', err);
                fs.unlink(uri, function() {});
            })
            .pipe(dest);

        index += 1;
        if (index < files.length) {
            setTimeout(function() {
                downloadFiles(auth, files, regex, interval, index);
            }, interval);
        }
    } else {
        index += 1;
        if (index < files.length) {
          downloadFiles(auth, files, regex, interval, index);
        }
    }
}

/**
 * Create a folder
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function createFolder(auth) {
    var fileMetadata = {
        'name': 'Invoices',
        'mimeType': 'application/vnd.google-apps.folder'
    };
    drive.files.create({
        auth: auth,
        resource: fileMetadata,
        fields: 'id'
    }, function(err, file) {
        if (err) {
            // Handle error
            console.log(err);
        } else {
            console.log('Folder Id: ', file.id);
        }
    });
}
