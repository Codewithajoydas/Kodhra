// function advance_search() {
//   let title = document.getElementById("title").value;
//   let code = document.getElementById("code").value;
//   let dexcription = document.getElementById("description").value;
//   let language = document.getElementById("language").value;
//   let folder = document.getElementById("folder").value;
//   let fromdate = document.getElementById("fromdate").value;
//   let enddate = document.getElementById("enddate").value;
//   let url = `/search/json?query=${
//     title || code || dexcription
//   }&language=${language}&folder=${folder}&fromdate=${fromdate}&enddate=${enddate}`;
//   window.location.href = url;
// }

// let filter = document.getElementById("filter");
// filter.addEventListener("click", (e) => {
//   e.stopPropagation();
//   let advanced_search = document.querySelector(".advanced-search");
//   advanced_search.classList.toggle("active");
//   document.querySelector("body").classList.toggle("active");
// });

// document.addEventListener("click", (e) => {
//   let advanced_search = document.querySelector(".advanced-search");
//   advanced_search.classList.remove("active");
//   document.querySelector("body").classList.remove("active");
// });

// let advanced_searchOne = document.querySelector(".advanced-search");
// advanced_searchOne.addEventListener("click", (e) => {
//   e.stopPropagation();
// });
