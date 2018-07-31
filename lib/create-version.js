const readline = require('readline');
const columnify = require('columnify');
const authenticate = require('./functions/authenticate.js');
const error = require('./functions/error.js');
const checkbox = require('./functions/checkbox.js');
const getId = require('./functions/getId.js');
const getMetadata = require('./functions/getMetadata.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const findInProject = require('./functions/findInProject.js');
const createVersion = require('./functions/createVersion.js');
const constants = require('./constants.js');

/**
 * Create a new version of a Google Apps Script project
 *
 * @param {Object} options - Extra options.
 * @returns {void}
 */
module.exports = async (options) => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        process.stdout.write('Creating new version...');
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
        process.stdout.write(`Creating new version for '${metadata.name}'...`);
        const version = await createVersion(auth, metadata.projectId, options.description);
        checkbox.display('green');

        console.log(columnify([version, ], {
            columns: ['versionNumber', 'createTime', 'description', ],
        }));
        process.exit(0);
    } catch (err) {
        await error.log(err, auth);
        process.exit(1);
    }
};
