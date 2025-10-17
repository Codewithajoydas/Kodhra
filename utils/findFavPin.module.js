/**
 * Find favorite and pinned cards
 * @param {Array} cardIds
 * @param {String} userId
 * @returns {Object}
 */
const User = require("../models/User");

async function findFavPinned(cardIds = [], userId) {
  const user = await User.findById(userId).select("favoriteCards pinnedCards");
  if (!user) return { favoriteCards: [], pinnedCards: [] };

  const favoriteCards = new Set(user.favoriteCards.map((id) => id.toString()));
  const pinnedCards = new Set(user.pinnedCards.map((id) => id.toString()));

  const result = cardIds.map((card) => ({
    ...card._doc,
    isFavorite: favoriteCards.has(card._id.toString()),
    isPinned: pinnedCards.has(card._id.toString()),
  }));

  return result;
}


module.exports = findFavPinned;