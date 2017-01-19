var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var open = require('open');
var color = require('colors');
var constants = require('../constants.js');

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {function} callback The callback to call with the authorized client.
 */
module.exports = function(options, callback) {
    var clientSecret = constants.CLIENT_SECRET;
    var clientId = constants.CLIENT_ID;
    var redirectUrl = constants.REDIRECT_URL;
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    if (options.force) {
        fs.unlink(constants.TOKEN_DIR + constants.TOKEN_FILE, function() {});
    }

    // Check if we have previously stored a token.
    fs.readFile(constants.TOKEN_DIR + constants.TOKEN_FILE, function(err, token) {
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
        scope: constants.SCOPES
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
            storeToken(token, function(){});
            callback(oauth2Client);
        });
    });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 * @param {getEventsCallback} callback
 */
function storeToken(token, callback) {
    try {
        fs.mkdirSync(constants.TOKEN_DIR, function(){});
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(constants.TOKEN_DIR + constants.TOKEN_FILE, JSON.stringify(token), function(){});
    console.log('Token stored to ' + constants.TOKEN_DIR + constants.TOKEN_FILE);
    callback();
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
