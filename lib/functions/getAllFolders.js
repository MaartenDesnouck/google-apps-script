const fs = require('fs-extra');
const path = require('path');

/**
 * List all folders in a directory
 *
 * @param {dir} dir - Current folder.
 * @param {Object} folderlist - List of folders already found.
 * @param {Boolean} resursive - Also get folders from deeper levels
 * @returns {Object} - List of all folders in dir
 */
function getAllFolders(dir, folderlist, recursive = true, includeFolderInPath = true) {
    const files = fs.readdirSync(dir);
    folderlist = folderlist || [];
    files.forEach((file) => {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            let filePath
            if (includeFolderInPath) {
                filePath = path.join(dir, file);
            } else {
                filePath = file;
            }
            if (recursive) {
                folderlist = getAllFolders(filePath, folderlist, true, false);
            }
            folderlist.push(filePath);
        }
    });
    return folderlist;
}

module.exports = getAllFolders;
