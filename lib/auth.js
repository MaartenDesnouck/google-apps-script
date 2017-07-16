const authenticate = require('./functions/authenticate.js');
const handleError = require('./functions/handleError.js');
const getUserInfo = require('./functions/getUserInfo.js');
const printCheckbox = require('./functions/printCheckbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');

/**
 * Get the metadata of a file with a given id
 *
 * @param {object} options - Extra options.
 * @returns {void}
 */
module.exports = (options) => {
    options.refresh = true;
    const checkedVersion = checkNewVersion();
    const gotAuth = authenticate(options);

    const gotUserInfo = Promise.all([gotAuth, checkedVersion, ]).then((values) => {
        return getUserInfo(values[0]);
    });

    gotUserInfo.then((info) => {
        process.stdout.write(`You are successfully authenticated as \'${info.email}\'`);
        printCheckbox('green');
        return;
    });

    // Catch all the errors
    gotAuth.then((auth) => {
        Promise.all([checkedVersion, gotUserInfo, ]).catch((err) => {
            handleError(auth, err, false);
            return;
        });
    }).catch((err) => {
        handleError(null, err, false);
        return;
    });
};
