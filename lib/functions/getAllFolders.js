const fs = require('fs');
const path = require('path');

/**
 * List all folders in a directory
 *
 * @param {dir} dir - Current folder.
 * @param {folderlist} folderlist - List of folders already found.
 * @returns {folderList}
 */
function getAllFolders(dir, folderlist) {
    const files = fs.readdirSync(dir);
    folderlist = folderlist || [];
    files.forEach((file) => {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            folderlist = getAllFolders(path.join(dir, file), folderlist);
            folderlist.push(path.join(dir, file));
        }
    });
    return folderlist;
}

module.exports = getAllFolders;
