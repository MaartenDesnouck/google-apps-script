const constants = require('../constants.js');
const displayCheckbox = require('./displayCheckbox.js');
const fs = require('fs');
const path = require('path');

/**
 * Display status info about the project.
 *
 * @returns {void}
 */
function displayStatusInfo() {
    return new Promise((resolve, reject) => {
        const local = path.join(constants.META_DIR, constants.META_LOCAL);
        const remote = path.join(constants.META_DIR, constants.META_REMOTE);

        const localData = JSON.parse(fs.readFileSync(local, 'utf8'));
        const remoteData = JSON.parse(fs.readFileSync(remote, 'utf8'));

        var files = [];
        var keys = []

        // Construct array with filename, extension and location as key
        // TODO make this 1 loop
        for (const localResult of localData.files) {
            const extension = (localResult.type === 'html' ? '.html' : '.js');
            const key = `${localResult.name}${extension}.local`;
            keys.push(key);
            localResult.location = 'local';
            files[key] = localResult;
        }
        for (const remoteResult of remoteData.files) {
            const extension = (remoteResult.type === 'html' ? '.html' : '.js');
            const key = `${remoteResult.name}${extension}.remote`;
            keys.push(key);
            remoteResult.location = 'remote';
            files[key] = remoteResult;
        }
        // TODO make this 1 loop

        // Sort keys
        keys.sort();
        console.log(keys);

        // Iterate over all keys
        let allOk = true;
        for (var i = 0; i < keys.length; i++) {
            const file = files[keys[i]];
            const nextFile = files[keys[i + 1]];

            console.log(JSON.stringify(file));
            if (file.name === nextFile.name && file.type === nextFile.type) {
                // TODO check if content is the same
            } else if (file.location === 'local') {
                // TODO new file
            } else if (file.location === 'local') {
                // TODO new remote file
            }

        }

        // Display something if everything is ok
        if (allOk) {
            process.stdout.write(`You local files and Google Drive are in sync`);
            displayCheckbox(`green`);
        }

        // TODO ignore or at least do something special for included files
    });
}

module.exports = displayStatusInfo;
