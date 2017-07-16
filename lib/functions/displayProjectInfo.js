/**
 * Display info about the project.
 *
 * @param {Object} metadata - Metadata to display.
 * @returns {void}
 */
function displayProjectInfo(metadata) {
    console.log(`   name:           ${metadata.name}`);
    console.log(`   id:             ${metadata.id}`);
    console.log(`   description:    ${metadata.description}`);
    console.log(`   createdAt:      ${metadata.createdTime}`);
    console.log(`   lastModifiedAt: ${metadata.modifiedTime}`);
    return;
}

module.exports = displayProjectInfo;
