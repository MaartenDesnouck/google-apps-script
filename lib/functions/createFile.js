const fs = require('fs');

/**
 * Synch create file and necessary folders
 *
 * @param {object} file - File to create.
 * @returns {void}
 */
function createFile(file) {
    const folderPath = file.name.split('/').slice(0, -1);
    const folder = folderPath.join('/');

    for (let depth = 1; depth <= folderPath.length; depth++) {
        const partialFolderPath = folderPath.slice(0, depth).join('/');
        if (!fs.existsSync(partialFolderPath) && partialFolderPath !== '') {
            fs.mkdirSync(partialFolderPath);
        }
    }
    fs.writeFileSync(file.name, file.source);
    return;
}

module.exports = createFile;
