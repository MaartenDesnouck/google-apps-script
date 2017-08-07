const fs = require('fs-extra');
const path = require('path');

/**
 * Find the project root folder
 *
 * @param {object} dir - CurrentDir.
 * @returns {void}
 */
function getProjectRoot(dir) {
    return new Promise((resolve, reject) => {
        const fullPath = process.cwd();
        const pieces = fullPath.split(path.sep);

        let folderCounter = 0;
        let found = false;
        let folder = dir;
        while (folderCounter < pieces.length - 1 && !found) {
            if (fs.existsSync(path.join(folder, '.gas'))) {
                found = true;
            } else {
                folderCounter++;
                folder = path.join('..', folder);
            }
        }
        resolve({
            found,
            folder
        });
    });
}

module.exports = getProjectRoot;
