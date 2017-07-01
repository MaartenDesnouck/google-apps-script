const colors = require('colors');
const clone = require('./clone.js');
const authenticate = require('./functions/authenticate.js');
const remoteCreateProject = require('./functions/remoteCreateProject.js');
const handleError = require('./functions/handleError.js');

/**
 * Create a new local and remote Google Apps Script project.
 *
 * @param {string} name - Name of the new Google Apps Script project.
 */
module.exports = function(name) {
    process.stdout.write('Creating \'' + name + '\' in Google Drive...');
    authenticate([], function(err, auth) {
        if (err) {
            process.stdout.write(' [' + '✘'.red + ']\n');
            handleError(auth, err);
        } else {
            remoteCreateProject(auth, name, function(err, result) {
                if (err) {
                    process.stdout.write(' [' + '✘'.red + ']\n');
                    handleError(auth, err);
                } else {
                    process.stdout.write(' [' + '✔'.green + ']\n');
                    clone(result.id, name, function(err) {
                        if (err) {
                            handleError(auth, err);
                        }
                    });
                }
            });
        }
    });
}
