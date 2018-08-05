const fs = require('fs-extra');
const path = require('path');
const parse = require('parse-gitignore');
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
 * Add a .gasignore file if none is present yet
 *
 * @param {String} rootFolder - Folder to add .gasignore in
 * @returns {void}
 */
function addGasIgnore(rootFolder) {

    // If no .gitignore files exists, add one
    const gasignore = path.join(rootFolder, constants.IGNORE_FILE);
    if (!fs.existsSync(gasignore)) {
        fs.writeFileSync(gasignore, gasignoreContent);
    }
}

/**
 * Get a list of regexes of filenames to ignore while pushing
 *
 * @param {String} rootFolder - relative path to the rootFolder of the project
 * @returns {array} - An array of regexes
 */
function getIgnoreRegexes(rootFolder) {
    const gasignoreFilepath = path.join(rootFolder, constants.IGNORE_FILE);

    let regexes = [];
    if (fs.existsSync(gasignoreFilepath)) {
        regexes = parse(fs.readFileSync(gasignoreFilepath));
    }
    return regexes;
}

module.exports = {
    addGitIgnore,
    addGasIgnore,
    getIgnoreRegexes,
};
