const request = require('request-promise');
const firebase = require('firebase');
const fs = require('fs-extra');
const path = require('path');
const semver = require('semver');
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

        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }

        const credential = firebase.auth.GoogleAuthProvider.credential(auth.credentials.id_token);
        await firebase.auth().signInWithCredential(credential);

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
        userInfo.version = pjson.version;
        userInfo.lastLogin = {
            ".sv": "timestamp",
        };

        const infoUrl = `${constants.FIREBASE_DATABASE_URL}/users/${userId}.json?auth=${token}`;

        await request({
            url: infoUrl,
            method: "PATCH",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: userInfo,
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
async function test(auth, rootPath) {
    // check if version does not exist yet
    // check if user is allowed to publish
    // check if version is larger than last version

    package = fs.readJsonSync(path.join(rootPath, constants.PACKAGE));
    code = fs.readJsonSync(path.join(rootPath, '.gas/publish.json'));

    const versionUrl = package.version.replace(/\./g, '_');
    // console.log(semver.valid(package.version));
    // console.log(versionUrl);

    try {
        const authenticated = await authWithFirebase(auth);
        const token = await firebase.auth().currentUser.getIdToken();
        const userId = firebase.auth().currentUser.uid;
        let url;
        let result;

        // Set a packageName to active
        url = `${constants.FIREBASE_DATABASE_URL}/packages/${package.name}.json?auth=${token}`;
        result = await request({
            url,
            method: "PATCH",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: {
                status: 'active',
            },
        });

        // Patch users in a package
        url = `${constants.FIREBASE_DATABASE_URL}/package/${package.name}/userIds/${userId}.json?auth=${token}`;
        result = await request({
            url,
            method: "PATCH",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: {
                status: 'active',
            },
        });

        // Set version of a package to active
        url = `${constants.FIREBASE_DATABASE_URL}/package/${package.name}/versions/${versionUrl}.json?auth=${token}`;
        result = await request({
            url,
            method: "PATCH",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: {
                status: 'active',
            },
        });

        // Set latest to correct version
        url = `${constants.FIREBASE_DATABASE_URL}/package/${package.name}/latest.json?auth=${token}`;
        result = await request({
            url,
            method: "PATCH",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: {
                version: versionUrl,
            },
        });

        // Patch a version in a package
        url = `${constants.FIREBASE_DATABASE_URL}/package/${package.name}/version/${versionUrl}.json?auth=${token}`;
        result = await request({
            url,
            method: "PATCH",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: {
                code,
                dependencies: package.dependencies,
                description: package.description,
                homepage: package.homepage,
                license: package.license,
                readme: 'README.md',
                repository: package.repository,
                timestamp: {
                    ".sv": "timestamp",
                },
                userId,
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
