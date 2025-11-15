/**
 * @typedef {Object} Activity
 * @property {string} title
 * @property {string} author
 * @property {"created"|"updated"|"deleted"|"viewed"|"downloaded"|"shared"|"renamed"|"moved"|"logged_in"|"logged_out"|"imported"|"exported"|"restored"} activity
 * @property {"snippet"|"folder"|"tag"|"user"|"file"|"setting"|"system"|"other"} entityType
 * @property {string} entityId
 * @property {"success"|"failure"|"pending"} status
 */

const Activity = require("../models/activity");
/**
 * Create a new activity record.
 * @param {Activity} params - activity data
 * @returns {Promise<Activity>} The saved activity document
 */
async function createActivity(params) {
  const { title, author, activity, entityType, entityId, status } = params;
  try {
    const doc = new Activity({
      title,
      author,
      activity,
      entityType,
      entityId,
      status,
    });
    await doc.save();
    return doc;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create activity");
  }
}

module.exports = createActivity;
