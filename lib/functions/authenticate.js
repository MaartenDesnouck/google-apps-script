const fs = require('fs-extra');
const path = require('path');
const {
    google,
} = require('googleapis');
const request = require('request');
const openWebpage = require('opn');
const http = require('http');
const url = require('url');
const constants = require('../constants.js');
const createFile = require('./createFile.js');
const firebase = require('./firebase.js');

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token - The token to store to the filesystem.
 * @returns {void}
 */
function storeToken(token) {
    const file = {
        name: path.join(constants.GLOBAL_DIR, constants.GLOBAL_TOKEN),
        source: JSON.stringify(token),
    };
    createFile(file);
    return;
}

/**
 * Get a token for a the defaut Oauth client.
 *
 * @param {google.auth.OAuth2} code - Optional code to get token for.
 * @param {google.auth.OAuth2} token - Optional token to refresh.
 * @param {google.auth.OAuth2} oauth2Client - The OAuth2 client to get token for.
 * @returns {Promise} - A promise resolving a tokent
 */
function getTokenDefault(code, token, oauth2Client) {
    return new Promise((resolve, reject) => {
        const requestData = {
            code,
            token,
        };
        request({
            url: 'https://us-central1-gas-include.cloudfunctions.net/getToken',
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: requestData,
        }, (error, response, body) => {
            const token = body;
            if (error) {
                reject(error);
            } else if (response.statusCode === 200) {
                resolve(token);
            } else {
                reject({
                    message: 'Failed to get a token for the default Oauth client.',
                    print: true,
                });
            }
        });
    });
}

/**
 * Get a token for a custom Oauth client.
 *
 * @param {google.auth.OAuth2} code - Optional code to get token for.
 * @param {google.auth.OAuth2} oauth2Client - The OAuth2 client to get token for.
 * @returns {Promise} - A promise resolving a token
 */
function getTokenCustom(code, oauth2Client) {
    return new Promise((resolve, reject) => {
        if (code) {
            oauth2Client.getToken(code, (err, newToken) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(newToken);
                return;
            });
        } else {
            oauth2Client.refreshAccessToken((err, newToken) => {
                if (err) {
                    reject(err);
                }
                resolve(newToken);
                return;
            });
        }
    });
}

/**
 * Get and store new token after prompting for user authorization.
 *
 * @param {google.auth.OAuth2} code - Optional code to get token for.
 * @param {google.auth.OAuth2} token - Optional token to refresh.
 * @param {google.auth.OAuth2} oauth2Client - The OAuth2 client to get token for.
 * @param {bool} isCustomClient - Wether or not this is a custom oauthclient.
 * @returns {Promise} - A promise resolving an auth client
 */
function getToken(code, token, oauth2Client, isCustomClient) {
    return new Promise((resolve, reject) => {
        if (isCustomClient) {
            getTokenCustom(code, oauth2Client).then((newToken) => {
                oauth2Client.credentials = newToken;
                storeToken(newToken);
                resolve(oauth2Client);
                return;
            }, (err) => {
                reject(err);
                return;
            });
        } else {
            getTokenDefault(code, token, oauth2Client).then((newToken) => {
                oauth2Client.credentials = newToken;
                storeToken(newToken);
                resolve(oauth2Client);
                return;
            }, (err) => {
                reject(err);
                return;
            });
        }
    });
}

/**
 * Get and store new token after prompting for user authorization.
 *
 * @param {google.auth.OAuth2} oauth2Client - The OAuth2 client to get token for.
 * @param {bool} isCustomClient - Whether or not this is a custom oauthclient.
 * @param {Object} [options] - Extra options.
 * @returns {Promise} - A promise resolving an auth client
 */
function getNewToken(oauth2Client, isCustomClient, options) {
    return new Promise((resolve, reject) => {
        const server = http.createServer((req, res) => {
            const parsedUrl = url.parse(req.url, true);
            const queryAsObject = parsedUrl.query;
            if (queryAsObject.code) {
                getToken(queryAsObject.code, null, oauth2Client, isCustomClient).then((newOauth2Client) => {
                    resolve(newOauth2Client);
                    return;
                }, (err) => {
                    reject(err);
                    return;
                });
            } else {
                reject();
                return;
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

        if (options.showUrl) {
            console.log('Please go to the following url in your browser:');
            console.log('----------------------------------------------');
            console.log(authUrl);
            console.log('----------------------------------------------');
        } else {
            openWebpage(authUrl);
        }

        console.log(`A webbrowser should have opened, to allow 'gas' to:`);
        console.log(`    'View and manage the files in your Google Drive'`);
        console.log(`    'Modify your Google Apps Script scripts' behavior'`);
        console.log(`    'Create and update Google Apps Script projects'`);
        console.log(`    'Create and update Google Apps Script deployments'`);
        console.log(``);
        console.log(`These permissions are necessary for pulling and pushing code from/to your remote scripts.`);
    });
}

/**
 * Create an OAuth2 client with the given credentials.
 *
 * @returns {Promise} - A promise resolving an auth client
 */
function getAuthClient() {
    return new Promise((resolve, reject) => {
        const redirectUrl = constants.REDIRECT_URL;
        const port = constants.REDIRECT_PORT;
        const configFilepath = path.join(constants.GLOBAL_DIR, constants.GLOBAL_CONFIG);

        let clientId = constants.CLIENT_ID;
        let clientSecret = null;
        let custom = false;

        // Parse config file
        try {
            const config = fs.readJsonSync(configFilepath, 'utf8');
            if (config.client) {
                clientSecret = config.client.secret;
                clientId = config.client.id;
                custom = true;
            }
        } catch (err) {
            reject(err);
            return;
        }

        const client = new google.auth.OAuth2(clientId, clientSecret, `${redirectUrl}:${port}`);

        resolve({
            client,
            custom,
        });
    });
}

/**
 * Create an OAuth2 client with the given credentials.
 *
 * @param {Object} options - Extra options.
 * @returns {google.auth.OAuth2} - An Oauth2 client
 */
async function authenticate(options) {
    const tokenFile = path.join(constants.GLOBAL_DIR, constants.GLOBAL_TOKEN);
    const configFile = path.join(constants.GLOBAL_DIR, constants.GLOBAL_CONFIG);

    // Ensure a config file exists
    if (!fs.pathExistsSync(configFile)) {
        createFile({
            name: configFile,
            source: `{}\n`,
        });
    }

    // Remove the token file if we are forcing reauth
    if (options.force) {
        fs.removeSync(tokenFile);
    }

    // get Oauth client
    const oauth2ClientResult = await getAuthClient();
    const oauth2Client = oauth2ClientResult.client;
    const isCustomClient = oauth2ClientResult.custom;
    let newOauth2Client;

    // Check if we have previously stored a token.
    let token;
    try {
        token = fs.readFileSync(tokenFile, 'utf8');
    } catch (err) {
        newOauth2Client = await getNewToken(oauth2Client, isCustomClient, options);
        await firebase.setUserInfo(newOauth2Client);
        return newOauth2Client;
    }

    // If we can find the token, refresh it, get a new one or do nothing
    const tokenObject = JSON.parse(token);
    oauth2Client.credentials = tokenObject;
    const ttl = oauth2Client.credentials.expiry_date - Date.now();

    if (ttl < 10 * 1000 || options.refresh) {
        try {
            newOauth2Client = await getToken(null, token, oauth2Client, isCustomClient);
            await firebase.setUserInfo(newOauth2Client);
            return newOauth2Client;
        } catch (err) {
            newOauth2Client = await getNewToken(oauth2Client, isCustomClient, options);
            await firebase.setUserInfo(newOauth2Client);
            return newOauth2Client;
        }
    } else {
        return oauth2Client;
    }
}

module.exports = authenticate;
