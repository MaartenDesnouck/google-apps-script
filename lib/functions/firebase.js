const request = require('request-promise');
const firebase = require('firebase');
const constants = require('../constants.js');
const getUserInfo = require('./getUserInfo.js');
const error = require('./errorFirebase.js');
const pjson = require('../../package.json');

/**
 * Get firebase credentails
 * 
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @returns {Promise} - Promise resolving a firebase credential
 */
async function authWithFirebase(auth) {
    try {
        const config = {
            apiKey: 'AIzaSyC5dVRphYjAxP6deLEqeGp3Hd49UGjOK8Q',
            databaseURL: constants.FIREBASE_DATABASE_URL,
        };

        try {
            firebase.getInstance();
        } catch (err) {
            firebase.initializeApp(config);
            const credential = firebase.auth.GoogleAuthProvider.credential(auth.credentials.id_token);
            await firebase.auth().signInWithCredential(credential);
        }

        return true;
    } catch (err) {
        err.origin = 'authWithFirebase';
        await error.log(err);
        return false;
    }
}

/**
 * Log user to firebase
 * 
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @returns {Promise} - a promise resolving true if user info has been set in firebase
 */
async function setUserInfo(auth) {
    try {
        const authenticated = await authWithFirebase(auth);
        const token = await firebase.auth().currentUser.getIdToken();
        const userId = firebase.auth().currentUser.uid;
        const userInfo = await getUserInfo(auth);
        const infoUrl = `${constants.FIREBASE_DATABASE_URL}/users/${userId}/info.json?auth=${token}`;
        const loginUrl = `${constants.FIREBASE_DATABASE_URL}/users/${userId}/login.json?auth=${token}`;

        await request({
            url: infoUrl,
            method: "PATCH",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: userInfo,
        });
        await request({
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
                },
            },
        });
        return true;
    } catch (err) {
        err.origin = 'setUserInfo';
        await error.log(err);
        return false;
    }
}

/**
 * Firebase test function
 * 
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @return {Boolean} - true if test was succesful, false otherwise
 */
async function test(auth) {
    try {
        const authenticated = await authWithFirebase(auth);
        const token = await firebase.auth().currentUser.getIdToken();
        const userId = firebase.auth().currentUser.uid;
        const url = `${constants.FIREBASE_DATABASE_URL}/test/${userId}.json?auth=${token}`;
        const result = await request({
            url,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: {
                data: 'hello world9',
            },
        });
        return true;
    } catch (err) {
        err.origin = 'test';
        await error.log(err);
        return false;
    }
}

module.exports = {
    test,
    setUserInfo,
    authWithFirebase,
};
