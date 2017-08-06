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
                'https://www.googleapis.com/auth/userinfo.email',
            ],
        },
        'APP_DIR': {
            value: path.join(os.homedir(), '.google-apps-script'),
        },
        'TOKEN_FILE': {
            value: 'token.json',
        },
        'INFO_FILE': {
            value: 'info.json',
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
        'META_DIR': {
            value: '.gas',
        },
        'META_LOCAL': {
            value: 'local.json',
        },
        'META_REMOTE': {
            value: 'remote.json',
        },
        'META_ID': {
            value: 'ID',
        },
        'INCLUDE_FILE': {
            value: 'gas-include.js',
        },
        'INCLUDE_DIR': {
            value: 'gas-include',
        },
        'IGNORE': {
            value: '/*gas-ignore*/',
        },
        'CLIENT_ID': {
            value: '671639553297-3v4k3ft385jpg3c0bv201o9ua2065b26.apps.googleusercontent.com',
        },
        'CLIENT_SECRET': {
            value: 'O7l__BTJWVvP23MOa98eh4DV',
        },
    });
}

module.exports = new Constants();
