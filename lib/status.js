const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const getMetadata = require('./functions/getMetadata.js');
const handleError = require('./functions/handleError.js');
const packLocal = require('./functions/packLocal.js');
const downloadRemote = require('./functions/downloadRemote.js');
const displayStatusInfo = require('./functions/displayStatusInfo.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const getProjectRoot = require('./functions/getProjectRoot.js');
const displayCheckbox = require('./functions/displayCheckbox.js');

/**
 * Display info about a google apps script project
 *
 * @param {string} identifier - Id of the project we want info about.
 * @returns {void}
 */
module.exports = async() => {
    const checkedVersion = await checkNewVersion();
    const projectRoot = await getProjectRoot('.');
    const auth = await authenticate([]);

    let id;
    if (projectRoot.found) {
        id = await getId(projectRoot.folder);
    } else {
        process.stdout.write(`Can't seem to find a Google Apps Script project here.`);
        displayCheckbox('red');
        return;
    }

    const metadata = await getMetadata(auth, id);
    const downloaded = await downloadRemote(auth, id, projectRoot.folder, 'pull');
    const packed = await packLocal(projectRoot.folder);

    const displayedStatusInfo = await displayStatusInfo(projectRoot.folder, metadata);
    return;
};
