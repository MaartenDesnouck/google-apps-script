const authenticate = require('./functions/authenticate.js');
const columnify = require('columnify');
const getScripts = require('./functions/getScripts.js');
const error = require('./functions/error.js');
const checkNewVersion = require('./functions/checkNewVersion.js');
const checkbox = require('./functions/checkbox.js');

/**
 * List all remote Google Apps Script projects matching an optional name filter.
 *
 * @param {String} filter - Filter to filter projects on.
 * @returns {void}
 */
module.exports = async (filter) => {
    let auth;
    try {
        const checkedVersion = await checkNewVersion();
        auth = await authenticate([]);
        const scripts = await getScripts(auth, filter, null, []);

        if (scripts.length > 0) {
            console.log(columnify(scripts, {
                columns: ['id', 'name', ],
            }));
            process.exit(0);
        } else {
            console.log(`No remote standalone projects matching the filter found ${checkbox.get('red')}`);
            process.exit(1);
        }

    } catch (err) {
        await error.log(err, auth);
        process.exit(1);
    }
};
