/**
 * Display info about the project.
 *
 * @param {Object} metadata - Metadata to display.
 * @returns {void}
 */
function displayProjectInfo(metadata) {
    console.log(`NAME             ${metadata.name}`);
    console.log(`ID               ${metadata.projectId}`);
    console.log(`CREATED_AT       ${metadata.createTime}`);
    console.log(`LAST_MODIFIED_AT ${metadata.updateTime}`);
    console.log(`CREATOR          ${metadata.creator.name} - ${metadata.creator.email}`);
    return;
}

module.exports = displayProjectInfo;
