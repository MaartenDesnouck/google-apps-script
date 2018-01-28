const fs = require('fs-extra');
const path = require('path');
const constants = require('../constants.js');

const gitignoreContent = `# .gitignore for Google Apps Script projects using https://www.npmjs.com/package/google-apps-script\n` +
    `${constants.META_DIR}/*\n${constants.INCLUDE_DIR}/*\n`;

const gasignoreContent = `# .gasignore for Google Apps Script projects using https://www.npmjs.com/package/google-apps-script\n` +
    `node_modules/*\n`;

/**
 * Add a gitignore file if none is present yet
 *
 * @param {String} rootFolder - Folder to add .gitignore in
 * @returns {void}
 */
function addGitIgnore(rootFolder) {

    // If no .gitignore files exists, add one
    const gitignore = path.join(rootFolder, '.gitignore');
    if (!fs.existsSync(gitignore)) {
        fs.writeFileSync(gitignore, gitignoreContent);
    }
}

/**
 * Add a gasignore file if none is present yet
 *
 * @param {String} rootFolder - Folder to add .gasignore in
 * @returns {void}
 */
function addGasIgnore(rootFolder) {

    // If no .gitignore files exists, add one
    const gasignore = path.join(rootFolder, '.gasignore');
    if (!fs.existsSync(gasignore)) {
        fs.writeFileSync(gasignore, gasignoreContent);
    }
}

module.exports = {
    addGitIgnore,
    addGasIgnore,
};
