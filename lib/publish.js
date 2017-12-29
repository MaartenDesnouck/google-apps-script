const readline = require('readline');
const authenticate = require('./functions/authenticate.js');
const error = require('./functions/error.js');
const checkbox = require('./functions/checkbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const firebase = require('./functions/firebase.js');
const findInProject = require('./functions/findInProject.js');
const packLocal = require('./functions/packLocal.js');

/**
 * Publish a project to gas-include
 *
 * @returns {void}
 */
module.exports = async() => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        process.stdout.write('Publishing to gas-include...');
        auth = await authenticate([]);

        // Will have to detect a package.json 
        const packageJson = await findInProject('.', 'package.json');
        const projectRoot = await findInProject('.', '.gas');
        const packed = await packLocal(projectRoot.folder, true);
        const result = await firebase.test(auth, packageJson.folder, projectRoot.folder);

        checkbox.display('green');
        process.exit(0);
    } catch (err) {
        checkbox.display('red');
        await error.log(err, auth);
        process.exit(1);
    }
};
