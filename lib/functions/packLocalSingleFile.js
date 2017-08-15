const fs = require('fs-extra');
const path = require('path');
const createFile = require('./createFile.js');
const getAllFiles = require('./getAllFiles.js');
const constants = require('../constants.js');

/**
 * Pack all seperate .js files back into a raw google script file
 *
 * @param {string} rootFolder - relative path to the rootFolder of the project
 * @returns {Promise} - A promise resolving no value
 */
function packLocalSingleFile(rootFolder, fileName) {
    // Read every local file and create a correct local.json file
    return new Promise((resolve, reject) => {
        console.log(fileName);
    });
}

module.exports = packLocalSingleFile;
