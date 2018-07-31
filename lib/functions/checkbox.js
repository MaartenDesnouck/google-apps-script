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
 * Get a checkbox
 *
 * @param {String} color - Identifier of the type of checkbox you want to print
 * @returns {void}
 */
function get(color) {
    const symbols = getSymbols();
    let result;
    if (color === 'green') {
        result = `[${symbols.check.green}]`;
    } else if (color === 'red') {
        result = `[${symbols.cross.red}]`;
    } else if (color === 'yellow') {
        result = `[${symbols.check.yellow}]`;
    }
    return result;
}

/**
 * Show a checkbox to the user if action was successful or not
 *
 * @param {String} color - Identifier of the type of checkbox you want to print
 * @returns {void}
 */
function display(color) {
    process.stdout.write(` ${get(color)}\n`);
    return;
}


module.exports = {
    get,
    display,
};
