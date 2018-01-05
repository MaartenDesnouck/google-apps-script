const fs = require('fs-extra');
const path = require('path');

/**
 * List all folders in a directory
 *
 * @param {dir} dir - Current folder.
 * @param {object} folderlist - List of folders already found.
 * @returns {object} - List of all folders in dir
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
