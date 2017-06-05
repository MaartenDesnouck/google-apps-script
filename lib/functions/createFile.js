var fs = require('fs');
var mkdirp = require('mkdirp');

/**
 * Synch create file and necessary folders
 *
 * @param {object} file - File to create.
 */
function createFile(file) {
    folderPath = file.name.split('/').slice(0, -1)
    folder = folderPath.join('/');

    for(folderDepth in folderPath) {
        partialFolderPath = folderPath.slice(0, folderDepth + 1).join('/');
        if(!fs.existsSync(partialFolderPath)){
            fs.mkdirSync(partialFolderPath);
        }
    }
    fs.writeFileSync(file.name, file.source);
};

module.exports = createFile;
