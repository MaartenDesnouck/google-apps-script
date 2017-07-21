const fs = require('fs');
const path = require('path');

/**
 * List all files in a directory recursively in a synchronous fashion
 *
 * @param {dir} dir - Current folder.
 * @param {filelist} filelist - List of files already found.
 * @returns {filelist} - List of all files in dir
 */
function getAllFiles(dir, filelist) {
    const files = fs.readdirSync(dir);
    filelist = filelist || [];
    for (const file of files) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = getAllFiles(path.join(dir, file), filelist);
        } else {
            filelist.push(path.join(dir, file));
        }
    }
    return filelist;
}

module.exports = getAllFiles;
