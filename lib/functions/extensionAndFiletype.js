const fs = require('fs-extra');
const path = require('path');
const constants = require('../constants.js');

/**
 * Get the correct extension from the filetype
 *
 * @param {String} filetype - Filetype we will convert.
 * @param {array} codeExtensions - Array of extensions we should treat as pushable for code files
 * @returns {String} method - The extension matching the filetype.
 */
function getExtensionFromFiletype(filetype, codeExtensions) {
    let extension;
    if (filetype === 'HTML') {
        extension = '.html';
    } else if (filetype === 'JSON') {
        extension = '.json';
    } else {
        extension = codeExtensions[0];
    }

    return extension;
}

/**
 * Get the correct filetype from the extension
 *
 * @param {String} extension - Extension we will convert
 * @returns {String} filetype - The filetype matching the extension.
 */
function getFiletypeFromExtension(extension) {
    let filetype;
    if (extension === '.html') {
        filetype = 'HTML';
    } else if (extension === '.json') {
        filetype = 'JSON';
    } else {
        filetype = 'SERVER_JS';
    }

    return filetype;
}

/**
 * Check if we can push a file to remote
 *
 * @param {String} extension - The extension of the file we are checking
 * @param {String} filename - The name without extension of the file we are checking
 * @param {array} codeExtensions - Array of extensions we should treat as pushable for code files
 * @param {array} ignoreRegexes - Array of regexes we should ignore
 * @returns {boolean} - Boolean whether this file is pushable or not
 */
function isPushable(extension, filename, codeExtensions, ignoreRegexes) {

    const fullFilename = `${filename}${extension}`;
    let ignored = false;

    const filenameAndExtensionIsValid = (codeExtensions && codeExtensions.indexOf(extension) > -1 || extension === '.html' || (extension === '.json' && filename === 'appsscript'));

    for (const regex of ignoreRegexes) {
        if (fullFilename.match(regex)) {
            ignored = true;
            break;
        }
    }

    return filenameAndExtensionIsValid && !ignored;
}

/**
 * Get a list of codextensions for code files (normaly either .gs or .js)
 *
 * @returns {array} - An array of extensions
 */
function getCodeExtensions() {
    const configFilepath = path.join(constants.GLOBAL_DIR, constants.GLOBAL_CONFIG);
    const extensions = [];

    // Parse config file
    const config = fs.readJsonSync(configFilepath, 'utf8');
    if (config.extension) {
        extensions.push(config.extension);
    }

    // Default
    if (extensions.length === 0) {
        extensions.push('.js');
    }

    return extensions;
}

module.exports = {
    getExtensionFromFiletype,
    getFiletypeFromExtension,
    isPushable,
    getCodeExtensions,
};
