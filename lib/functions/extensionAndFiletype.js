/**
 * Get the correct extension from the filetype
 *
 * @param {string} filetype - Filetype we will convert.
 * @returns {string} method - The extension matching the filetypen.
 */
function getExtensionFromFiletype(fileType) {
    let extension;
    if (fileType === 'html') {
        extension = '.html';
    } else if (fileType === 'json') {
        extension = '.json';
    } else {
        extension = '.js';
    }

    return extension;
}

/**
 * Get the correct filetype from the extension
 *
 * @param {string} extension - Extension we will convert
 * @returns {string} filetype - The filetype matching the extension.
 */
function getFileTypeFromExtension(extension) {
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
 * @returns {boolean} - Boolean wether this file is pushable or not
 */
function isPushable(extension, filename) {
    return (extension === '.js' ||
        extension === '.gs' ||
        extension === '.html' ||
        (extension === '.json' && filename === 'appsscript'));
}

module.exports = {
    getExtensionFromFiletype,
    getFileTypeFromExtension,
    isPushable,
};
