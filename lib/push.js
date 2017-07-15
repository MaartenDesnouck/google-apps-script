const pull = require('./pull.js');
const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const packLocal = require('./functions/packLocal.js');
const pushToRemote = require('./functions/pushToRemote.js');
const downloadRemote = require('./functions/downloadRemote.js');
const getMetadata = require('./functions/getMetadata.js');
const handleError = require('./functions/handleError.js');
const printCheckbox = require('./functions/printCheckbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Push all local code to the remote Google Apps Script project
 *
 * @returns {void}
 */
module.exports = () => {
    process.stdout.write('Pushing code to Google Drive...');
    var checkedVersion = checkNewVersion();
    var gotAuth = authenticate([]);
    var gotId = getId();

    var gotMetadata = Promise.all([gotAuth, gotId, checkedVersion]).then(values => {
        return getMetadata(values[0], values[1]);
    });

    var packed = gotMetadata.then(() => {
        return packLocal('.');
    });

    var pushed = Promise.all([gotAuth, gotId, packed]).then(values => {
        return pushToRemote(values[0], values[1]);
    });

    pushed.then(() => {
        printCheckbox('green');
    }).catch({
        // Yeah, we'll need to revert
    })

    // Catch all the errors
    Promise.all([gotAuth, gotId, gotMetadata, packed, pushed, checkedVersion]).catch(err => {
        if (value[0]) {
            handleError(value[0], err, false);
        } else {
            handleError(null, err, false);
        }
    });
};
