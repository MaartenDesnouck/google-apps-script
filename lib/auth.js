const authenticate = require('./functions/authenticate.js');
const handleError = require('./functions/handleError.js');
const displayCheckbox = require('./functions/displayCheckbox.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const getUserInfo = require('./functions/getUserInfo.js');

/**
 * Get the metadata of a file with a given id
 *
 * @param {object} options - Extra options.
 * @returns {void}
 */
module.exports = (options) => {
    options.refresh = true;

    const checkedVersion = checkNewVersion();

    const gotAuth = Promise.all([checkedVersion, ]).then(() => {
        return authenticate(options);
    });

    const gotUserInfo = Promise.all([gotAuth, ]).then((values) => {
        return getUserInfo(values[0]);
    });

    gotUserInfo.then((info) => {
        process.stdout.write(`You are successfully authenticated as \'${info.email}\'`);
        displayCheckbox('green');
        return;
    }).catch((err) => {
        handleError(err, false);
        return;
    });
};
