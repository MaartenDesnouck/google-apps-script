const fs = require('fs');
const path = require('path');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const firebase = require('firebase');
const openWebpage = require('open');
const http = require('http');
const url = require('url');
const request = require('request');
const constants = require('../constants.js');
const createFile = require('./createFile.js');
const handleError = require('./handleError.js');

const config = {
    apiKey: "AIzaSyC5dVRphYjAxP6deLEqeGp3Hd49UGjOK8Q",
    authDomain: "gas-include.firebaseapp.com",
    //databaseURL: "https://gas-include.firebaseio.com",
};

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 * @param {getEventsCallback} callback
 */
function storeToken(token, callback) {
    const file = {
        name: path.join(constants.APP_DIR, constants.TOKEN_FILE),
        source: JSON.stringify(token),
    };
    createFile(file);
    callback();
    return;
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
    firebase.initializeApp(config);

    const server = http.createServer((req, res) => {
        const parsedUrl = url.parse(req.url, true);
        const queryAsObject = parsedUrl.query;
        if (queryAsObject.code) {
            oauth2Client.getToken(queryAsObject.code, (err, token) => {
                if (err) {
                    callback(err);
                    return;
                }
                oauth2Client.credentials = token;
                const credential = firebase.auth.GoogleAuthProvider.credential(token.id_token);
                firebase.auth().signInWithCredential(credential).then(() => {
                    //console.log(firebase.auth().currentUser);
                    storeToken(token, function(err) {
                        callback(err, oauth2Client);
                        return;
                    });
                }).catch((err) => {
                    console.log(err);
                    callback(err, oauth2Client);
                    return;
                });
            });
        }

        res.writeHead(302, {
            'Location': 'https://gas-include.firebaseapp.com',
        });
        res.end();

        req.connection.end(); //close the socket
        req.connection.destroy(); //close it really
        server.close(); //close the server
    }).listen(constants.REDIRECT_PORT);

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: constants.SCOPES,
    });

    openWebpage(authUrl);
    console.log('A webbrowser should have opened, to allow \'gas\' to:');
    console.log('    \'View and manage the files in your Google Drive\'');
    console.log('    \'Modify your Google Apps Script scripts\' behavior\'');
    console.log('');
    console.log('These permissions are necessary for pulling and pushing code from/to your Google Drive.');
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {object} options Extra options.
 * @param {callback} callback The callback to call with the authorized client.
 */
function authenticate(options, callback) {
    const clientSecret = constants.CLIENT_SECRET;
    const clientId = constants.CLIENT_ID;
    const redirectUrl = constants.REDIRECT_URL;
    const port = constants.REDIRECT_PORT;
    const auth = new googleAuth();
    const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl + ':' + port);

    if (options.force) {
        fs.unlink(constants.APP_DIR + '/' + constants.TOKEN_FILE, () => {});
    }

    // Check if we have previously stored a token.
    fs.readFile(constants.APP_DIR + '/' + constants.TOKEN_FILE, (err, token) => {
        if (err) {
            getNewToken(oauth2Client, callback);
        } else {
            oauth2Client.credentials = JSON.parse(token);
            const ttl = oauth2Client.credentials.expiry_date - Date.now();

            if (ttl < 10 * 1000 || options.refresh) {
                oauth2Client.refreshAccessToken((err, token) => {
                    if (err) {
                        getNewToken(oauth2Client, callback);
                    } else {
                        oauth2Client.credentials = token;
                        storeToken(token, () => {
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

module.exports = authenticate;
