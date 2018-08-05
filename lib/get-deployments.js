const columnify = require('columnify');
const authenticate = require('./functions/authenticate.js');
const error = require('./functions/error.js');
const checkbox = require('./functions/checkbox.js');
const getId = require('./functions/getId.js');
const getMetadata = require('./functions/getMetadata.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const findInProject = require('./functions/findInProject.js');
const getDeployments = require('./functions/getDeployments.js');
const constants = require('./constants.js');

/**
 * List the deployments of the specified project
 *
 * @param {String} identifier - Id of the project we want to get the deployments of.
 * @returns {void}
 */
module.exports = async (identifier) => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        const projectRoot = await findInProject('.', constants.META_DIR);
        auth = await authenticate([]);

        let id;
        if (identifier) {
            id = identifier;
        } else if (projectRoot.found) {
            id = await getId(projectRoot.folder);
        } else {
            throw {
                message: `Can't seem to find a Google Apps Script project here`,
                print: true,
            };
        }

        const metadata = await getMetadata(auth, id);
        const deployments = await getDeployments(auth, metadata.projectId);

        if (deployments.deployments && deployments.deployments.length > 0) {
            deployments.deployments.forEach((deployment) => {
                deployment.versionNumber = deployment.deploymentConfig.versionNumber;
                deployment.manifestFileName = deployment.deploymentConfig.manifestFileName;
                deployment.description = deployment.deploymentConfig.description;
            });

            console.log(columnify(deployments.deployments, {
                columns: ['deploymentId', 'versionNumber', 'manifestFileName', 'updateTime', 'description', ],
            }));
            process.exit(0);
        } else {
            console.log(`Can't seem to find any deployments for '${metadata.name}' ${checkbox.get('red')}`);
            process.exit(1);
        }

    } catch (err) {
        await error.log(err, auth);
        process.exit(1);
    }
};
