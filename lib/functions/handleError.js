var constants = require('../constants.js');
var fs = require('fs');
var colors = require('colors');

/**
 * Handle error in an appropriate hanner
 *
 * @param {err} string - The error to handle.
 */
function handleError(err) {
    if (err == 'Error: Invalid Credentials') {
        console.log('✘'.red + ' Your credentials appear to be invalid.'); 
        console.log('Run \'gas auth -f\' to re-authenicate.');
    } else if (err.code == 'ENOENT') {
        console.log('✘'.red + ' There appears to be no project linked to this folder. \n' +
            'Navigate to a project folder or execute \'gas new <name>\',' +
            ' \'gas clone <fileId>\' or \'gas link <fileId>\' to get started.');
    } else {
        console.log('✘'.red + ' gas returned an error: ' + err);
    }
}

module.exports = handleError;
