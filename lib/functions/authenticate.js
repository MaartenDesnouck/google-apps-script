const fs = require('fs-extra');
const path = require('path');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const request = require('request');
const openWebpage = require('open');
const http = require('http');
const url = require('url');
const constants = require('../constants.js');
const createFile = require('./createFile.js');
const getUserInfo = require('./getUserInfo.js');
const handleError = require('./handleError.js');
const pjson = require('../../package.json');

/**
 * Log user
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @returns {void}
 */
function logAuth(auth) {
    getUserInfo(auth).then((userInfo) => {
        const requestData = {
            version: pjson.version,
            info: userInfo,
        };

        request({
            url: 'https://gas-include.firebaseio.com/logs/auth.json',
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: requestData,
        });
    }).catch((err) => {
        return;
    });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token - The token to store to disk.
 * @returns {Promise} - A promise resolving no value
 */
function storeToken(token) {
    return new Promise((resolve, reject) => {
        const file = {
            name: path.join(constants.APP_DIR, constants.TOKEN_FILE),
            source: JSON.stringify(token),
        };
        createFile(file);
        resolve();
        return;
    });
}

/**
 * Get and store new token after prompting for user authorization.
 *
 * @param {google.auth.OAuth2} oauth2Client - The OAuth2 client to get token for.
 * @returns {Promise} - A promise resolving an auth client
 */
function getNewToken(oauth2Client) {
    return new Promise((resolve, reject) => {
        const server = http.createServer((req, res) => {
            const parsedUrl = url.parse(req.url, true);
            const queryAsObject = parsedUrl.query;
            if (queryAsObject.code) {
                oauth2Client.getToken(queryAsObject.code, (err, token) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    oauth2Client.credentials = token;
                    storeToken(token).then(() => {
                        resolve(oauth2Client);
                        return;
                    }, (err) => {
                        reject(err);
                        return;
                    });
                });
            }

            res.writeHead(302, {
                'Location': 'https://gas-include.firebaseapp.com/info/auth_successful.html',
            });
            res.end();

            req.connection.end(); // close the socket
            req.connection.destroy(); // close it really
            server.close(); // close the server
        }).listen(constants.REDIRECT_PORT);

        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: constants.SCOPES,
        });

        openWebpage(authUrl);
        console.log(`A webbrowser should have opened, to allow 'gas' to:`);
        console.log(`    'View and manage the files in your Google Drive'`);
        console.log(`    'Modify your Google Apps Script scripts' behavior'`);
        console.log(``);
        console.log(`These permissions are necessary for pulling and pushing code from/to your Google Drive.`);
    });
}

/**
 * Create an OAuth2 client with the given credentials.
 *
 * @param {Object} options - Extra options.
 * @returns {Promise} - A promise resolving an auth client
 */
function authenticate(options) {
    return new Promise((resolve, reject) => {
        const clientSecret = constants.CLIENT_SECRET;
        const clientId = constants.CLIENT_ID;
        const redirectUrl = constants.REDIRECT_URL;
        const port = constants.REDIRECT_PORT;
        const auth = new googleAuth();
        const oauth2Client = new auth.OAuth2(clientId, clientSecret, `${redirectUrl}:${port}`);

        if (options.force) {
            fs.unlinkSync(path.join(constants.APP_DIR, constants.TOKEN_FILE));
        }

        // Check if we have previously stored a token.
        fs.readFile(path.join(constants.APP_DIR, constants.TOKEN_FILE), (err, token) => {
            if (err !== null || token == '') {
                getNewToken(oauth2Client).then((oauth2Client) => {
                    logAuth(oauth2Client);
                    resolve(oauth2Client);
                    return;
                }, (err) => {
                    reject(err);
                    return;
                });
            } else {
                oauth2Client.credentials = JSON.parse(token);
                const ttl = oauth2Client.credentials.expiry_date - Date.now();

                if (ttl < 10 * 1000 || options.refresh) {
                    oauth2Client.refreshAccessToken((err, token) => {
                        if (err) {
                            getNewToken(oauth2Client).then((oauth2Client) => {
                                resolve(oauth2Client);
                                return;
                            }, (err) => {
                                reject(err);
                                return;
                            });
                        } else {
                            oauth2Client.credentials = token;
                            storeToken(token).then(() => {
                                resolve(oauth2Client);
                                return;
                            }, (err) => {
                                reject(err);
                                return;
                            });
                        }
                    });
                } else {
                    resolve(oauth2Client);
                    return;
                }
            }
        });
    });
}

module.exports = authenticate;
