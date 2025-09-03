/**
 * Move card/folder to folder
 * @param {string} type - type of movement
 * @param {string} parentId - id of parent folder
 * @param {string} childId - id of child folder
 * @returns {Promise<object>} - response JSON
 */
const moveIt = async (type, parentId, childId) => {
  try {
    const res = await fetch(`moveit/${type}/${parentId}/${childId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to move: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Error in moveIt:", err);
    throw err; 
  }
};

module.exports = moveIt;
