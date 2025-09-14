require("dotenv").config();

const generateImages = async (imageType, page) => {
  try {
    let res = await fetch(
      `https://api.unsplash.com/search/photos/?query=${imageType}&page=${page}&orientation=landscape&per_page=30&client_id=${process.env.UNSPLASH_KEY}`
    );
      let data = await res.json();
      if (res.ok) {
          return data;
      } else {
          return `Something wrong with api url! \n ${data}`
      }
  } catch (error) {
      return `Something wrong!  \n ${error}`
  }
};

module.exports = generateImages;