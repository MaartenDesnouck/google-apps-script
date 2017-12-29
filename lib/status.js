const constants = require('./constants.js');
const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const getMetadata = require('./functions/getMetadata.js');
const error = require('./functions/error.js');
const packLocal = require('./functions/packLocal.js');
const downloadRemote = require('./functions/downloadRemote.js');
const displayStatusInfo = require('./functions/displayStatusInfo.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const findInProject = require('./functions/findInProject.js');
const displayCheckbox = require('./functions/displayCheckbox.js');

/**
 * Display info about a google apps script project
 *
 * @param {string} identifier - Id of the project we want info about.
 * @returns {void}
 */
module.exports = async() => {
    try {
        const checkedVersion = await checkNewVersion();
        const projectRoot = await findInProject('.', constants.META_DIR);
        const auth = await authenticate([]);

        if (!projectRoot.found) {
            process.stdout.write(`Can't seem to find a Google Apps Script project here.`);
            displayCheckbox('red');
            process.exit(1);
        }

        const id = await getId(projectRoot.folder);
        const metadata = await getMetadata(auth, id);
        const downloaded = await downloadRemote(auth, id, projectRoot.folder, 'pull');
        const packed = await packLocal(projectRoot.folder);
        const displayedStatusInfo = await displayStatusInfo(projectRoot.folder, metadata);
        process.exit(0);
    } catch (err) {
        process.stdout.write(`Something seems to have gone wrong.`);
        displayCheckbox('red');
        await error.log(err);
        process.exit(1);
    }
};
