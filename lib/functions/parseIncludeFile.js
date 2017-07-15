const constants = require('../constants.js');
const fs = require('fs');
const path = require('path');

const include = new RegExp('^(\'([^\']*)\'|\"([^\"]*)\")[ ]*-[ ]*(\'([^\']*)\'|\"([^\"]*)\")[ ]*$');
const ignore = new RegExp('^([ ]*//.*)|([ ]*)$');

/**
 * Parse the content of the include file.
 *
 * @returns {Promise}
 */
function parseIncludeFile() {
    return new Promise((resolve, reject) => {
        const includeFile = path.join('.', constants.INCLUDE_FILE);
        fs.readFile(includeFile, 'utf8', (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    // Include file does not exist yet
                    const content = "// Example content of gas-include.js\n" +
                        "// \"time.js\" - \"https://raw.githubusercontent.com/MaartenDesnouck/google-apps-script-include/master/Time.js\"\n";

                    fs.writeFile(includeFile, content, () => {});
                    resolve([]);
                    return;
                } else {
                    reject(err);
                    return;
                }
            } else {
                // Parse content of include file
                let files = [];
                let lineNr = 0;
                const lines = content.split("\n");

                for (const line of lines) {
                    lineNr++;
                    const matchInclude = include.exec(line);
                    const matchIgnore = ignore.exec(line);
                    let name;
                    let url;

                    if (matchInclude) {
                        if (matchInclude[2]) {
                            name = matchInclude[2];
                        } else if (matchInclude[3]) {
                            name = matchInclude[3];
                        } else {
                            reject('There seems to be a mistake in your ' + constants.INCLUDE_FILE + ' file at line ' + lineNr + '.');
                            return;
                        }

                        if (matchInclude[5]) {
                            url = matchInclude[5];
                        } else if (matchInclude[6]) {
                            url = matchInclude[6];
                        } else {
                            reject('There seems to be a mistake in your ' + constants.INCLUDE_FILE + ' file at line ' + lineNr + '.');
                            return;
                        }
                        const file = [name, url];
                        files.push(file);
                    } else if (matchIgnore) {
                        // Do nothing
                    } else {
                        reject('There seems to be a mistake in your ' + constants.INCLUDE_FILE + ' file at line ' + lineNr + '.');
                        return;
                    }
                }
                resolve(files);
                return;
            }
        });
    });
}

module.exports = parseIncludeFile;
