const request = require('request-promise');
const firebase = require('firebase');
const constants = require('../constants.js');
const getUserInfo = require('./getUserInfo.js');
const handleError = require('./handleError.js');
const pjson = require('../../package.json');

/**
 * Get firebase credentails
 * 
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @returns {Promise}
 */
function getCredentials(auth) {
    return new Promise((resolve, reject) => {
        var config = {
            apiKey: "AIzaSyC5dVRphYjAxP6deLEqeGp3Hd49UGjOK8Q",
            authDomain: "gas-include.firebaseapp.com",
            databaseURL: constants.FIREBASE_DATABASE_URL,
            storageBucket: "gas-include.appspot.com",
            messagingSenderId: "671639553297",
        };

        firebase.initializeApp(config);
        const credential = firebase.auth.GoogleAuthProvider.credential(auth.credentials.id_token);
        firebase.auth().signInWithCredential(credential).then(function (result) {
            resolve(credential);
            return;
        }).catch(function (error) {
            reject(error);
            return;
        });
    });
}

/**
 * Log user to firebase
 * 
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @returns {Promise}
 */
function setUserInfo(auth) {
    return new Promise((resolve, reject) => {
        getCredentials(auth).then(function (credentials) {
            const userId = firebase.auth().currentUser.uid;
            getUserInfo(auth).then((userInfo) => {
                const infoUrl = constants.FIREBASE_DATABASE_URL + '/users/' + userId + '/info.json?access_token=' + auth.credentials.access_token;
                const loginUrl = constants.FIREBASE_DATABASE_URL + '/users/' + userId + '/login.json?access_token=' + auth.credentials.access_token;

                console.log(infoUrl);

                request({
                    url: infoUrl,
                    method: "PATCH",
                    json: true,
                    headers: {
                        "content-type": "application/json",
                    },
                    body: userInfo,
                });
                request({
                    url: loginUrl,
                    method: "POST",
                    json: true,
                    headers: {
                        "content-type": "application/json",
                    },
                    body: {
                        "version": pjson.version,
                        "timestamp": {
                            ".sv": "timestamp",
                        }
                    },
                });
                resolve();
            }).catch((err) => {
                console.log(err);
                reject(err, false);
                return;
            });
        }).catch(function (err) {
            console.log(err);
            reject(err, false);
            return;
        });
    });
}

/**
 * Firebase test function
 * 
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @return {Boolean} 
 */
async function test(auth) {
    var url = constants.FIREBASE_DATABASE_URL + '/libraries.json';
    try {
        var result = await request({
            url,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: {
                data: 'hello world8'
            },
        });
        console.log(result);
        return true;
    } catch (err) {
        //console.log(err);
        return false;
    }
}

module.exports = {
    test,
    setUserInfo,
};
