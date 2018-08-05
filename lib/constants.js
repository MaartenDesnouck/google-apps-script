const path = require('path');
const os = require('os');

/**
 * Define constants
 *
 * @returns {void}
 */
function Constants() {
    Object.defineProperties(this, {
        'SCOPES': {
            value: [
                'https://www.googleapis.com/auth/drive',
                'https://www.googleapis.com/auth/drive.scripts',
                'https://www.googleapis.com/auth/script.deployments',
                'https://www.googleapis.com/auth/script.projects',
                'email',
            ],
        },
        'GLOBAL_DIR': {
            value: path.join(os.homedir(), '.google-apps-script'),
        },
        'GLOBAL_TOKEN': {
            value: 'token.json',
        },
        'GLOBAL_INFO': {
            value: 'info.json',
        },
        'GLOBAL_CONFIG': {
            value: 'config.json',
        },
        'META_DIR': {
            value: '.gas',
        },
        'META_LOCAL': {
            value: 'local.json',
        },
        'META_REMOTE': {
            value: 'remote.json',
        },
        'META_PUBLISH': {
            value: 'publish.json',
        },
        'META_ID': {
            value: 'ID',
        },
        'REDIRECT_URL': {
            value: 'http://localhost',
        },
        'REDIRECT_PORT': {
            value: '9012',
        },
        'MIME_GAF': {
            value: 'application/vnd.google-apps.folder',
        },
        'MIME_GAS': {
            value: 'application/vnd.google-apps.script',
        },
        'MIME_GAS_JSON': {
            value: 'application/vnd.google-apps.script+json',
        },
        'INCLUDE_FILE': {
            value: 'gas-include.json',
        },
        'INCLUDE_DIR': {
            value: 'gas-include',
        },
        'IGNORE_FILE': {
            value: '.gasignore',
        },
        'CLIENT_ID': {
            value: '671639553297-1fo6jqpabv9q0uc9j3beob7hj5ukmtph.apps.googleusercontent.com',
        },
        'FIREBASE_DATABASE_URL': {
            value: 'https://gas-include.firebaseio.com',
        },
        'FIREBASE_DATABASE_PUBLIC_APIKEY': {
            value: 'AIzaSyC5dVRphYjAxP6deLEqeGp3Hd49UGjOK8Q',
        },
    });
}

module.exports = new Constants();
