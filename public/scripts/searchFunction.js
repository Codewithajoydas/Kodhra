const searchv1 = async (query) => {
  let query1 = encodeURIComponent(query);
  let res = await fetch(`/search?query=${query1}`);
  let data = await res.json();
  return data.findCards;
};

let results = document.getElementById("results");
let list = document.getElementById("results-list");
let searchInput = document.querySelector(".searchResult");
let search1 = document.getElementById("search");

search1.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const query = search1.value.trim();
    if (query) {
      window.location.href = `/search?query=${encodeURIComponent(query)}`;
    }
  }
});

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

search1.addEventListener(
  "input",
  debounce(() => {
    results.classList.add("active");
    list.textContent = "Loading Suggestions...";
    const query = search1.value.trim();
    if (!query) {
      results.classList.remove("active");
      document.body.classList.remove("active");
      list.innerHTML = "";
      return;
    }
    searchv1(query).then((data) => {
      list.innerHTML = "";
      if (!Array.isArray(data) || data.length === 0) {
        list.innerHTML = "<span style='color:red'>No Cards Found</span>";
        return;
      } else {
        data.forEach((card) => {
          const li = document.createElement("li");
          li.innerHTML = `
          <a href="/card/${card._id}">
           <div class="name">
             <svg xmlns="http://www.w3.org/2000/svg" 
                 width="18" height="18" viewBox="0 0 24 24" 
                 fill="none" stroke="currentColor" 
                 stroke-width="2" stroke-linecap="round" 
                 stroke-linejoin="round" 
                 class="lucide lucide-search-icon lucide-search">
              <path d="m21 21-4.34-4.34"/>
              <circle cx="11" cy="11" r="8"/>
            </svg> 
            ${card.title}
            </div>
            <div class="arrow" onclick="applytext(event,'${card.title}')"><svg xmlns="http://www.w3.org/2000/svg"  width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-left-icon lucide-arrow-up-left"><path d="M7 17V7h10"/><path d="M17 17 7 7"/></svg></div>
          </a>`;
          list.appendChild(li);
        });
      }
    });
  }, 500)
);
function applytext(e, t) {
  e.preventDefault();
  e.stopPropagation();
  search1.value = t;
}
document.addEventListener("click", (e) => {
  if (searchInput.contains(e.target) && search1.value !== "") {
    results.classList.add("active");
    document.body.classList.add("active");
  } else {
    results.classList.remove("active");
    document.body.classList.remove("active");
  }
});
