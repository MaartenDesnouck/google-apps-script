const readline = require('readline');
const columnify = require('columnify');
const authenticate = require('./functions/authenticate.js');
const error = require('./functions/error.js');
const checkbox = require('./functions/checkbox.js');
const getId = require('./functions/getId.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const findInProject = require('./functions/findInProject.js');
const getMetadata = require('./functions/getMetadata.js');
const createVersion = require('./functions/createVersion.js');
const createDeployment = require('./functions/createDeployment.js');
const constants = require('./constants.js');

/**
 * Create new deployement of a Google Apps Script
 *
 * @param {String} identifier - Id of the project we want to create a deployment for.
 * @param {Object} options - Extra options.
 * @returns {void}
 */
module.exports = async (identifier, options) => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        process.stdout.write('Creating a new deployment...');
        auth = await authenticate([]);
        const projectRoot = await findInProject('.', constants.META_DIR);

        let id;
        if (identifier) {
            id = identifier;
        } else if (projectRoot.found) {
            id = await getId(projectRoot.folder);
        } else {
            throw {
                message: `Can't seem to find a Google Apps Script project here.`,
                print: true,
            };
        }

        const metadata = await getMetadata(auth, id);

        readline.clearLine(process.stdout);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Creating a new deployment for '${metadata.title}'...`);

        let versionNumber;
        if (options.versionNumber) {
            versionNumber = options.versionNumber;
        } else {
            const version = await createVersion(auth, metadata.scriptId, options.description);
            versionNumber = version.versionNumber;
        }

        const deployment = await createDeployment(auth, metadata.scriptId, versionNumber, options.description);
        deployment.versionNumber = deployment.deploymentConfig.versionNumber;
        deployment.manifestFileName = deployment.deploymentConfig.manifestFileName;

        checkbox.display('green');
        console.log(columnify([deployment], {
            columns: ['deploymentId', 'versionNumber', 'manifestFileName', 'description', ],
        }));
        process.exit(0);
    } catch (err) {
        await error.log(err, auth);
        process.exit(1);
    }
};
