const colors = require('colors');

/**
 * Show a checkbox to the user if action was successful or not
 *
 * @returns {void}
 */
function printCheckbox(color) {
    switch (color) {
        case 'green':
            process.stdout.write(` [${'✔'.green}]\n`);
            break;
        case 'red':
            process.stdout.write(` [${'✘'.red}]\n`);
            break;
        case 'yellow':
            process.stdout.write(` [${'✔'.yellow}]\n`);
            break;
    }
    return;
}

module.exports = printCheckbox;
