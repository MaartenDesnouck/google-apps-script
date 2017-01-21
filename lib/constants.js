module.exports = {
    SCOPES: ['https://www.googleapis.com/auth/drive'],
    TOKEN_DIR: (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/',
    TOKEN_FILE: 'google-apps-script-by-mdsnouck.json',
    CLIENT_ID: '835520708717-cp90h45vu3jdeedoi9i0j7vhlaklmdg2.apps.googleusercontent.com',
    CLIENT_SECRET: 'zZLJL0FlCAn_PzQpFV3wRLLM',
    REDIRECT_URL: 'urn:ietf:wg:oauth:2.0:oob',
    META_DIR: './.gaps/',
    META_LOCAL: 'local.json',
    META_REMOTE: 'remote.json',
    META_ID: 'ID'
}
