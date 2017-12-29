const colors = require('colors');
const hasUnicode = require('has-unicode');

/**
 * Get the correct symbols based on ternminal cpapbilities
 *
 * @returns {Object} - object containing the correct symbols based on terminal capabilities
 */
function getSymbols() {
    const symbols = {};
    if (hasUnicode()) {
        symbols.check = '✔';
        symbols.cross = '✘';
    } else {
        symbols.check = 'v';
        symbols.cross = 'x';
    }
    return symbols;
}

/**
 * Show a checkbox to the user if action was successful or not
 *
 * @param {String} color - Identifier of the type of checkbox you want to print
 * @returns {void}
 */
function displayCheckbox(color) {
    const symbols = getSymbols();
    if (color === 'green') {
        process.stdout.write(` [${symbols.check.green}]\n`);
    } else if (color === 'red') {
        process.stdout.write(` [${symbols.cross.red}]\n`);
    } else if (color === 'yellow') {
        process.stdout.write(` [${symbols.check.yellow}]\n`);
    }
    return;
}

module.exports = displayCheckbox;
