const searchv1 = async (query) => {
  let res = await fetch(`/search?query=${query}`);
  let data = await res.json();
  return data;
};

