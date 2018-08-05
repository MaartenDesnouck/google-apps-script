const authenticate = require('./functions/authenticate.js');
const error = require('./functions/error.js');
const checkbox = require('./functions/checkbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const firebase = require('./functions/firebase.js');
const findInProject = require('./functions/findInProject.js');
const pack = require('./functions/pack.js');
const constants = require('./constants.js');

/**
 * Publish a project to gas-include
 *
 * @returns {void}
 */
module.exports = async () => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        process.stdout.write('Publishing to gas-include...');
        auth = await authenticate([]);
        const infoUpdated = await firebase.setUserInfo(auth);

        const packageJson = await findInProject('.', constants.INCLUDE_FILE);

        if (!packageJson.found) {
            throw {
                message: `Can't publish a package to gas-include without a gas-include.json\n'gas init' will help you get started`,
                print: true,
            };
        }

        const packed = await pack.publish(packageJson.folder);
        const result = await firebase.publish(auth, packageJson.folder);

        checkbox.display('green');
        process.exit(0);
    } catch (err) {
        checkbox.display('red');
        await error.log(err, auth);
        process.exit(1);
    }
};
