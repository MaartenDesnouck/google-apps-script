const readline = require('readline');
const authenticate = require('./functions/authenticate.js');
const error = require('./functions/error.js');
const displayCheckbox = require('./functions/displayCheckbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const firebase = require('./functions/firebase.js');
const findInProject = require('./functions/findInProject.js');

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
        console.log(packageJson);

        const result = await firebase.test(auth);

        displayCheckbox('green');
        process.exit(0);
    } catch (err) {
        displayCheckbox('red');
        await error.log(err, auth);
        process.exit(1);
    }
};
