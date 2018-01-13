/**
 * Display info about the project.
 *
 * @param {Object} metadata - Metadata to display.
 * @returns {void}
 */
function displayProjectInfo(metadata) {
    console.log(`   name:           ${metadata.title}`);
    console.log(`   id:             ${metadata.scriptId}`);
    console.log(`   createdAt:      ${metadata.createTime}`);
    console.log(`   lastModifiedAt: ${metadata.updateTime}`);
    console.log(`   creator:        ${metadata.creator.name} - ${metadata.creator.email}`);
    return;
}

module.exports = displayProjectInfo;
