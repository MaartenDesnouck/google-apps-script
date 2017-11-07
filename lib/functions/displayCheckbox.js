const colors = require('colors');
const hasUnicode = require('has-unicode');

/**
 * Show a checkbox to the user if action was successful or not
 *
 * @param {string} color - Identifier of the type of checkbox you want to print
 * @returns {void}
 */
function displayCheckbox(color) {
    let check;
    let cross;

    if (hasUnicode()) {
        check = '✔';
        cross = '✘';
    } else {
        check = 'v';
        cross = 'x';
    }

    switch (color) {
        case 'green':
            process.stdout.write(` [${check.green}]\n`);
            break;
        case 'red':
            process.stdout.write(` [${cross.red}]\n`);
            break;
        case 'yellow':
            process.stdout.write(` [${check.yellow}]\n`);
            break;
        default:
            break;
    }
    return;
}

module.exports = displayCheckbox;
