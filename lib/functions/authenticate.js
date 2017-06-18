var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var open = require('open');
var net = require('net');
var constants = require('../constants.js');
var handleError = require('./handleError.js');
var logUserInfo = require('./logUserInfo.js');

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {object} options Extra options.
 * @param {callback} callback The callback to call with the authorized client.
 */
function authenticate(options, callback) {
    var clientSecret = constants.CLIENT_SECRET;
    var clientId = constants.CLIENT_ID;
    var redirectUrl = constants.REDIRECT_URL;
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    if (options.force) {
        fs.unlink(constants.APP_DIR + '/' + constants.TOKEN_FILE, function() {});
    }

    // Check if we have previously stored a token.
    fs.readFile(constants.APP_DIR + '/' + constants.TOKEN_FILE, function(err, token) {
        if (err) {
            getNewToken(oauth2Client, callback);
        } else {
            oauth2Client.credentials = JSON.parse(token);
            var ttl = oauth2Client.credentials['expiry_date'] - (new Date).getTime();

            if (ttl < 10 * 1000 || options.refresh) {
                oauth2Client.refreshAccessToken(function(err, token) {
                    if (err) {
                        callback(err, oauth2Client);
                        return;
                    } else {
                        oauth2Client.credentials = token;
                        storeToken(token, function() {
                            callback(err, oauth2Client);
                            return;
                        });
                    }
                });

            } else {
                callback(err, oauth2Client);
                return;
            }
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
    var server = net.createServer(function(socket) {
        socket.on('data', function(data) {
            console.log(data.toString())
            socket.destroy()
            server.close()
        })
    })
    server.listen(8080);

    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: constants.SCOPES
    });

    open(authUrl);

    // var rl = readline.createInterface({
    //     input: process.stdin,
    //     output: process.stdout
    // });
    //
    // console.log('A webbrowser should have opened, to allow \'gas\' to:');
    // console.log('    \'View and manage the files in your Google Drive\'');
    // console.log('    \'Modify your Google Apps Script scripts\' behavior\'');
    // console.log('');
    // console.log('These permissions are necessary for pulling and pushing code from/to your Google Drive.');
    // rl.question('Please accept and enter the code from the follow up page here: ', function(code) {
    //     rl.close();
    //     oauth2Client.getToken(code, function(err, token) {
    //         if (err) {
    //             callback(err);
    //             return;
    //         }
    //         oauth2Client.credentials = token;
    //         storeToken(token, function(err) {
    //             logUserInfo(oauth2Client);
    //             callback(err, oauth2Client);
    //             return;
    //         });
    //     });
    // });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 * @param {getEventsCallback} callback
 */
function storeToken(token, callback) {
    try {
        fs.mkdirSync(constants.APP_DIR, function() {});
    } catch (err) {
        if (err.code != 'EEXIST') {
            callback(err);
            return;
        }
    }
    fs.writeFile(constants.APP_DIR + '/' + constants.TOKEN_FILE, JSON.stringify(token), function() {});
    callback();
    return;
}

module.exports = authenticate;
