const fs = require('fs');

/**
 * Synch create file and necessary folders
 *
 * @param {object} file - File to create.
 */
function createFile(file) {
    var folderPath = file.name.split('/').slice(0, -1);
    var folder = folderPath.join('/');

    for (var depth = 1; depth <= folderPath.length; depth++) {
        var partialFolderPath = folderPath.slice(0, depth).join('/');
        if (!fs.existsSync(partialFolderPath) && partialFolderPath !== '') {
            fs.mkdirSync(partialFolderPath);
        }
    }
    fs.writeFileSync(file.name, file.source);
}

module.exports = createFile;
