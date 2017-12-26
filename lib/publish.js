const readline = require('readline');
const authenticate = require('./functions/authenticate.js');
const handleError = require('./functions/handleError.js');
const displayCheckbox = require('./functions/displayCheckbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const firebase = require('./functions/firebase.js');

/**
 * Publish a project to gas-include
 *
 * @returns {void}
 */
module.exports = async () => {
    process.stdout.write('Publishing to gas-include...');
    
    const checkedVersion = await checkNewVersion();
    // console.log(checkedVersion);

    //Will have to detect a package.json 
    //const gotProjectRoot = getProjectRoot('.');

    const gotAuth = await authenticate([]);
    // console.log(gotAuth);

    const result = await firebase.test();
    // console.log(result);

    displayCheckbox('green');
};
