const colorThief = new ColorThief();

let fab = document.querySelector(".fab");
let imagesDiv = document.querySelector(".images");
let sentinel = document.querySelector(".sentinel");
fab.addEventListener("click", (e) => {
  e.stopPropagation();
  imagesDiv.classList.toggle("active");
  document.querySelector("body").classList.toggle("active");
});
imagesDiv.addEventListener("click", (e) => {
  e.stopPropagation();
});
document.addEventListener("click", (e) => {
  imagesDiv.classList.remove("active");
  document.querySelector("body").classList.remove("active");
});
let imagesList = document.querySelector(".images #images_data");
let search2 = document.getElementById("search2");

let main = document.querySelector("main");
let page = 1;
let img = "illustration";
document.querySelectorAll(".bg-topic").forEach((e) => {
  e.addEventListener("click", (e) => {
    imagesList.innerHTML = "";
    search2.value = e.target.innerHTML;
    img = e.target.innerHTML;
    images();
  });
});
search2.addEventListener("change", (e) => {
  imagesList.innerHTML = "";
  let value = e.target.value.trim();
  img = value;
  if (img === "") img = "3d illustration";
  debounce(() => {
    imagesList.innerHTML = "";
    images();
  }, 300);
});
async function images() {
  try {
    let res = await fetch(`/images?q=${img}&page=${page}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      console.log("Something went wrong!");
      return;
    }
    let data = await res.json();
    data.images.results.forEach((img) => {
      // Create li
      let li = document.createElement("li");
      li.className = "li";
      li.style.position = "relative";

      // Create image
      let imgEl = document.createElement("img");
      imgEl.src = img.urls.regular;
      imgEl.alt = img.alt_description || "Unsplash image";
      imgEl.crossOrigin = "anonymous";

      li.appendChild(imgEl);

      // Create button wrapper
      let btnDiv = document.createElement("div");
      btnDiv.classList.add("select_bnt");

      let selectBtn = document.createElement("button");
      selectBtn.textContent = "Select";

      selectBtn.addEventListener("click", () => {
        console.log("Selected image:", img.urls.regular);
        const color = colorThief.getPalette(imgEl, 5);
        console.log(color);
        const bg_color = `rgb(${color[0][0]}, ${color[0][1]}, ${color[0][2]})`;
        const text_color = `rgb(${color[1][0]}, ${color[1][1]}, ${color[1][2]})`;
        const accent = `rgb(${color[2][0]}, ${color[2][1]}, ${color[2][2]})`;
        document.body.style.setProperty("--bg-color", bg_color);
        document.body.style.setProperty("--color", text_color);
        document.body.style.setProperty("--accent", accent);
        localStorage.setItem("bg_color", bg_color);
        localStorage.setItem("text_color", text_color);
        localStorage.setItem("accent", accent);
        console.log(accent);
        main.style.background = `url(${img.urls.regular})`;
        localStorage.setItem("image", img.urls.full);
        main.style.backgroundSize = "cover";
        main.style.backgroundRepeat = "no-repeat";
        main.style.backgroundPosition = "center";
      });

      btnDiv.appendChild(selectBtn);
      li.appendChild(btnDiv);

      imagesList.appendChild(li);
    });
    page++;
  } catch (err) {
    console.error("Error fetching images:", err);
  }
}
images();

const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      images();
    }
  },
  {
    rootMargin: "0px 0px 1000px 0px",
    threshold: 0.5,
  }
);
observer.observe(sentinel);
const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((element) => {
  observer.observe(element);
});
function removeImage() {
  main.style.background = ``;
  document.body.style.setProperty("--bg-color", "#ffffff");
  document.body.style.setProperty("--color", "#000000");
  document.body.style.setProperty("--accent", "#24242417");
  localStorage.setItem("image", "");
  localStorage.setItem("bg_color", "#ffffff");
  localStorage.setItem("text_color", "#000000");
  localStorage.setItem("accent", "#24242417");
}
