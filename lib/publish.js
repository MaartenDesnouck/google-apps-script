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
    try {
        process.stdout.write('Publishing to gas-include...');
        const checkedVersion = await checkNewVersion();

        // Will have to detect a package.json 
        const packageJson = await findInProject('.', 'package.json');
        console.log(packageJson);

        const auth = await authenticate([]);
        const result = await firebase.test(auth);

        displayCheckbox('green');
        process.exit(0);
    } catch (err) {
        displayCheckbox('red');
        await error.log(err);
        process.exit(1);
    }
};
