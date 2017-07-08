const fs = require('fs');
const path = require('path');

/**
 * List all folders in a directory
 *
 * @param {dir} dir - Current folder.
 * @param {folderlist} folderlist - List of folders already found.
 */
function getAllFolders(dir, folderlist) {
    files = fs.readdirSync(dir);
    folderlist = folderlist || [];
    files.forEach(function(file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            folderlist = getAllFolders(path.join(dir, file), folderlist);
            folderlist.push(path.join(dir, file));
        }
    });
    return folderlist;
}

module.exports = getAllFolders;
