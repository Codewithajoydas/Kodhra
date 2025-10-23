const searchv1 = async (query) => {
  let query1 = encodeURIComponent(query);
  let res = await fetch(`/search/json?q=${query1}`);
  let data = await res.json();
  return data.findCards;
};
