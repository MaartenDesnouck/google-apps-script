const fs = require('fs-extra');

/**
 * Synch create file and necessary folders
 *
 * @param {Object} file - File to create.
 * @returns {void}
 */
function createFile(file) {
    fs.ensureFileSync(file.name);
    fs.writeFileSync(file.name, file.source);
    return;
}

module.exports = createFile;
