var fs = require('fs');
var mkdirp = require('mkdirp');

/**
 * Synch create file and necessary folders
 *
 * @param {object} file - File to create.
 */
function createFile(file) {
    folder = file.name.split('/').slice(0, -1).join('/');
    mkdirp(folder, function(err) {
        if (err) {
            throw err;
            return;
        } else {
            fs.writeFileSync(file.name, file.source);
            return;
        }
    });
};

module.exports = createFile;
