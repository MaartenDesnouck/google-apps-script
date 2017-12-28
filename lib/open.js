const open = require('open');
const authenticate = require('./functions/authenticate.js');
const getId = require('./functions/getId.js');
const getMetadata = require('./functions/getMetadata.js');
const error = require('./functions/error.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const getProjectRoot = require('./functions/getProjectRoot.js');
const displayCheckbox = require('./functions/displayCheckbox.js');

/**
 * Open a local project in the online editor.
 *
 * @param {String} identifier - Id of the project we want to open.
 * @returns {void}
 */
module.exports = async(identifier) => {
    try {
        const checkedVersion = await checkNewVersion();
        const projectRoot = await getProjectRoot('.');
        const auth = await authenticate([]);

        let id;
        if (identifier) {
            id = identifier;
        } else if (projectRoot.found) {
            id = await getId(projectRoot.folder);
        } else {
            process.stdout.write(`Can't seem to find a Google Apps Script project here.`);
            displayCheckbox('red');
            process.exit(1);
        }

        const metadata = await getMetadata(auth, id);
        open(`https://script.google.com/d/${metadata.id}/edit?usp=drive_web`);
        process.exit(0);
    } catch (err) {
        displayCheckbox('red');
        await error.handle(err);
        process.exit(1);
    }
};
