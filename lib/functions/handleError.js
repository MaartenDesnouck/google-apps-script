var fs = require('fs');
var colors = require('colors');
var constants = require('../constants.js');

/**
 * Handle error in an appropriate hanner
 *
 * @param {err} string - The error to handle.
 */
function handleError(err) {
    if (err == 'HANDELED') {
        // Do nothing
    } else if (err == 'Error: Invalid Credentials') {
        console.log('✘'.red + ' Your credentials appear to be invalid.');
        console.log('Run \'gas auth -f\' to re-authenicate.');
    } else if (err == 'Error: invalid_grant') {
        console.log('✘'.red + ' Your credentials appear to be invalid.');
        console.log('Run \'gas auth -f\' to re-authenticate.');
    } else if (err.code == 'ENOENT' && err.path == '.gas/ID') {
        console.log('✘'.red + ' There appears to be no project linked to this folder. \n' +
            'Navigate to a project folder or execute \'gas new <name>\',' +
            ' \'gas clone <fileId>\' or \'gas link <fileId>\' to get started.');
    } else if (err.code == 'ENOENT' && err.path == './gas-include.js') {
        console.log('There appears to be no \'gas-include.js\' file in this folder.');
    } else {
        console.log('gas returned an error: ' + err);
    }
}

module.exports = handleError;
