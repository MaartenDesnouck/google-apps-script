const colors = require('colors');

/**
 * Show a checkbox to the user if action was successful or not
 *
 * @param {string} color - Identifier of the type of checkbox you want to print
 * @returns {void}
 */
function displayCheckbox(color) {
    switch (color) {
        case 'green':
            process.stdout.write(` [${`✔`.green}]\n`);
            break;
        case 'red':
            process.stdout.write(` [${`✘`.red}]\n`);
            break;
        case 'yellow':
            process.stdout.write(` [${`✔`.yellow}]\n`);
            break;
        default:
            break;
    }
    return;
}

module.exports = displayCheckbox;
