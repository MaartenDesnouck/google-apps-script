const fs = require('fs-extra');
const path = require('path');
const constants = require('../constants.js');

/**
 * Get the correct extension from the filetype
 *
 * @param {string} filetype - Filetype we will convert.
 * @param {array} codeExtensions - Array of extensions we should treat as pushable for code files
 * @returns {string} method - The extension matching the filetype.
 */
function getExtensionFromFiletype(filetype, codeExtensions) {
    let extension;
    if (filetype === 'html') {
        extension = '.html';
    } else if (filetype === 'json') {
        extension = '.json';
    } else {
        extension = codeExtensions[0];
    }

    return extension;
}

/**
 * Get the correct filetype from the extension
 *
 * @param {string} extension - Extension we will convert
 * @returns {string} filetype - The filetype matching the extension.
 */
function getFiletypeFromExtension(extension) {
    let filetype;
    if (extension === '.html') {
        filetype = 'html';
    } else if (extension === '.json') {
        filetype = 'json';
    } else {
        filetype = 'server_js';
    }

    return filetype;
}

/**
 * Check if we can push a file to Google Drive
 *
 * @param {string} extension - The extension of the file we are checking
 * @param {string} filename - The name without etension of the file we are checking
 * @param {array} codeExtensions - Array of extensions we should treat as pushable for code files
 * @returns {boolean} - Boolean whether this file is pushable or not
 */
function isPushable(extension, filename, codeExtensions) {
    return (codeExtensions.indexOf(extension) > -1 ||
        extension === '.html' ||
        (extension === '.json' && filename === 'appsscript'));
}

/**
 * Get a list of codextensions for code files (normally either .gs or .js)
 *
 * @param {function} callback - Callback function
 * @returns {void}
 */
function getCodeExtensions(callback) {
    const configFilepath = path.join(constants.GLOBAL_DIR, constants.GLOBAL_CONFIG);
    const extensions = [];

    // Parse config file
    try {
        const config = fs.readJsonSync(configFilepath, 'utf8');
        if (config.extension) {
            extensions.push(config.extension);
        }
    } catch (err) {
        callback(err);
        return;
    }

    // Default
    if (extensions.length === 0) {
        extensions.push('.js');
    }

    callback(null, extensions);
    return;
}

module.exports = {
    getExtensionFromFiletype,
    getFiletypeFromExtension,
    isPushable,
    getCodeExtensions,
};
