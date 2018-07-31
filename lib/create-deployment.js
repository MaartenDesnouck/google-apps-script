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
 * @param {Object} options - Extra options.
 * @returns {void}
 */
module.exports = async (options) => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        process.stdout.write('Creating new deployment...');
        auth = await authenticate([]);
        const projectRoot = await findInProject('.', constants.META_DIR);

        let id;
        if (options.script) {
            id = options.script;
        } else if (projectRoot.found) {
            id = await getId(projectRoot.folder);
        } else {
            throw {
                message: `Can't seem to find a Google Apps Script project here`,
                print: true,
            };
        }

        const metadata = await getMetadata(auth, id);

        readline.clearLine(process.stdout);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Creating new deployment for '${metadata.name}'...`);

        let versionNumber;
        if (options.versionNumber) {
            versionNumber = options.versionNumber;
        } else {
            const version = await createVersion(auth, metadata.projectId, options.description);
            versionNumber = version.versionNumber;
        }

        const deployment = await createDeployment(auth, metadata.projectId, versionNumber, options.description);
        deployment.versionNumber = deployment.deploymentConfig.versionNumber;
        deployment.manifestFileName = deployment.deploymentConfig.manifestFileName;
        deployment.description = deployment.deploymentConfig.description;

        checkbox.display('green');
        console.log(columnify([deployment, ], {
            columns: ['deploymentId', 'versionNumber', 'manifestFileName', 'updateTime', 'description', ],
        }));
        process.exit(0);
    } catch (err) {
        await error.log(err, auth);
        process.exit(1);
    }
};
