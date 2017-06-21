var path = require('path');

function Constants() {
    Object.defineProperties(this, {
        'SCOPES': {
            value: [
                'https://www.googleapis.com/auth/drive',
                'https://www.googleapis.com/auth/drive.scripts',
                'https://www.googleapis.com/auth/userinfo.email',
            ]
        },
        'APP_DIR': {
            value: path.join((process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE), '.google-apps-script')
        },
        'TOKEN_FILE': {
            value: 'token.json'
        },
        'REDIRECT_URL': {
            value: 'http://localhost'
        },
        'REDIRECT_PORT': {
            value: '9012'
        },
        'MIME_GAF': {
            value: 'application/vnd.google-apps.folder'
        },
        'MIME_GAS': {
            value: 'application/vnd.google-apps.script'
        },
        'MIME_GAS_JSON': {
            value: 'application/vnd.google-apps.script+json'
        },
        'META_DIR': {
            value: '.gas'
        },
        'META_LOCAL': {
            value: 'local.json'
        },
        'META_REMOTE': {
            value: 'remote.json'
        },
        'META_ID': {
            value: 'ID'
        },
        'INCLUDE_FILE': {
            value: 'gas-include.js'
        },
        'INCLUDE_DIR': {
            value: 'gas-include'
        },
        'IGNORE': {
            value: '/*gas-ignore*/'
        },
        'CLIENT_ID': {
            value: '260584418392-juqf3j11foqrnth52ra35v0csvfkp2rm.apps.googleusercontent.com'
        },
        'CLIENT_SECRET': {
            value: 'pkv8GhAEkHtumUprWqXpdyvQ'
        },
    });
}


module.exports = new Constants();
