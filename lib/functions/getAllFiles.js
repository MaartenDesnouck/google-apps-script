var fs = require('fs');
var path = require('path');
var constants = require('../constants.js');

/**
 * List all files in a directory in Node.js recursively in a synchronous fashion
 *
 * @param {dir} dir - Current folder.
 * @param {filelist} filelist - List of files already found.
 */
function getAllFiles(dir, filelist) {
    files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = getAllFiles(path.join(dir, file), filelist);
        } else {
            filelist.push(path.join(dir, file));
        }
    });
    return filelist;
};

module.exports = getAllFiles;
