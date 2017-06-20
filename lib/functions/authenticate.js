var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var firebase = require('firebase');
var open = require('open');
var http = require('http');
var url = require('url');
var request = require('request');
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
    var port = constants.REDIRECT_PORT;
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl + ':' + port);

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
                        getNewToken(oauth2Client, callback);
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
    var server = http.createServer(function(req, res) {
        var parsedUrl = url.parse(req.url, true);
        var queryAsObject = parsedUrl.query;
        if (queryAsObject['code']) {
            oauth2Client.getToken(queryAsObject['code'], function(err, token) {
                if (err) {
                    callback(err);
                }
                oauth2Client.credentials = token;
                console.log(token);
                storeToken(token, function(err) {
                    logUserInfo(oauth2Client);
                    callback(err, oauth2Client);
                });
            });
        }

        res.writeHead(302, {
          'Location': 'https://gas-powered.firebaseapp.com'
        });
        res.end();

        req.connection.end(); //close the socket
        req.connection.destroy; //close it really
        server.close(); //close the server
    }).listen(constants.REDIRECT_PORT);

    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: constants.SCOPES
    });

    open(authUrl);
    console.log('A webbrowser should have opened, to allow \'gas-powered\' to:');
    console.log('    \'View and manage the files in your Google Drive\'');
    console.log('    \'Modify your Google Apps Script scripts\' behavior\'');
    console.log('');
    console.log('These permissions are necessary for pulling and pushing code from/to your Google Drive.');
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
        var config = {
            apiKey: "AIzaSyD3BtbRtYGJ1bH06NmwOXzg5C2Cw6dblD4",
            authDomain: "gas-powered.firebaseapp.com",
            databaseURL: "https://gas-powered.firebaseio.com",
            storageBucket: "gas-powered.appspot.com",
            messagingSenderId: "260584418392",
        };
        firebase.initializeApp(config);
        var credential = firebase.auth.GoogleAuthProvider.credential(token.id_token);
        firebase.auth().signInWithCredential(credential).catch(function(error) {
            // Handle Errors here.
            // TODO
        });
    } catch (err) {
        if (err.code != 'EEXIST') {
            callback(err);
        }
    }
    fs.writeFile(constants.APP_DIR + '/' + constants.TOKEN_FILE, JSON.stringify(token), function() {});
    callback();
}

module.exports = authenticate;
