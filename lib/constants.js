
var path = require('path');

function Constants () {
    Object.defineProperties(this,{
        'SCOPES':{value:[
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.scripts'
        ]},
        'APP_DIR':{value:path.join((process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE),'.google-apps-script/')},
        'CRED_FILE':{value:'cred.json'},
        'TOKEN_FILE':{value:'token.json'},
        'REDIRECT_URL':{value:'urn:ietf:wg:oauth:2.0:oob'},
        'META_DIR':{value:'.gas/'},
        'META_LOCAL':{value:'local.json'},
        'META_REMOTE':{value:'remote.json'},
        'META_ID':{value:'ID'},

        // Original app constants - to be deprecated once processes are updated for dynamic credential file.
        'TOKEN_DIR':{value:(process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/' + '.google-apps-script/'},
        'CLIENT_ID':{value:'835520708717-cp90h45vu3jdeedoi9i0j7vhlaklmdg2.apps.googleusercontent.com'},
        'CLIENT_SECRET':{value:'zZLJL0FlCAn_PzQpFV3wRLLM'},
    });
}


module.exports = new Constants();
