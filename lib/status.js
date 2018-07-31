const constants = require('./constants.js');
const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const getMetadata = require('./functions/getMetadata.js');
const error = require('./functions/error.js');
const pack = require('./functions/pack.js');
const downloadRemote = require('./functions/downloadRemote.js');
const displayStatusInfo = require('./functions/displayStatusInfo.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const findInProject = require('./functions/findInProject.js');
const checkbox = require('./functions/checkbox.js');

/**
 * Display info about a Google Apps Script project
 *
 * @param {String} identifier - Id of the project we want info about.
 * @returns {void}
 */
module.exports = async () => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        auth = await authenticate([]);
        const projectRoot = await findInProject('.', constants.META_DIR);

        if (!projectRoot.found) {
            throw {
                message: `Can't seem to find a Google Apps Script project here`,
                print: true,
            };
        }

        const id = await getId(projectRoot.folder);
        const metadata = await getMetadata(auth, id);
        const downloaded = await downloadRemote(auth, id, projectRoot.folder, 'pull');
        const packed = await pack.local(projectRoot.folder);
        const displayedStatusInfo = await displayStatusInfo(projectRoot.folder, metadata);
        process.exit(0);
    } catch (err) {
        checkbox.display('red');
        await error.log(err, auth);
        process.exit(1);
    }
};
