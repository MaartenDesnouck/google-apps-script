module.exports = {
    SCOPES: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.scripts'
    ],
    TOKEN_DIR: (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/' + '.credentials/',
    TOKEN_FILE: 'gas-by-maarten-desnouck.json',
    CLIENT_ID: '835520708717-cp90h45vu3jdeedoi9i0j7vhlaklmdg2.apps.googleusercontent.com',
    CLIENT_SECRET: 'zZLJL0FlCAn_PzQpFV3wRLLM',
    REDIRECT_URL: 'urn:ietf:wg:oauth:2.0:oob',
    META_DIR: '.gas/',
    META_LOCAL: 'local.json',
    META_REMOTE: 'remote.json',
    META_ID: 'ID'
}
