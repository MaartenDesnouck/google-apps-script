const fs = require('fs-extra');
const path = require('path');

/**
 * List all files in a directory recursively in a synchronous fashion
 * //NOTE: We act as if rootFolder is the rootFolder of the filesystem
 *
 * @param {String} rootFolder - relative path to the rootFolder of the project
 * @param {dir} dir - Current folder.
 * @param {filelist} filelist - List of files already found.
 * @returns {filelist} - List of all files in dir
 */
function getAllFiles(rootFolder, dir, filelist) {
    const files = fs.readdirSync(path.join(rootFolder, dir));
    filelist = filelist || [];
    for (const file of files) {
        if (fs.statSync(path.join(rootFolder, dir, file)).isDirectory()) {
            filelist = getAllFiles(rootFolder, path.join(dir, file), filelist);
        } else {
            filelist.push(path.join(dir, file));
        }
    }
    return filelist;
}

module.exports = getAllFiles;
