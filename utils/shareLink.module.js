/**
 * @param {String} folderId
 * @param {String} userId
 * @param {String} hostName
 * @returns {String}
 */

function shareLink(userId, folderId, hostName) {
  return `${hostName}/folder/${userId}/${folderId}`;
}
module.exports = shareLink;
