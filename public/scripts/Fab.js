// // === Setup ===
// const colorThief = new ColorThief();

// const fab = document.querySelector(".fab");
// const imagesDiv = document.querySelector(".images");
// const sentinel = document.querySelector(".sentinel");
// const imagesList = document.querySelector(".images #images_data");
// const search2 = document.getElementById("search2");
// const main = document.querySelector("main");

// let page = 1;
// let imgQuery = "3d wallpapers";


// // === FAB toggle ===
// fab.addEventListener("click", (e) => {
//   e.stopPropagation();
//   imagesDiv.classList.toggle("active");
//   document.body.classList.toggle("active");
// });

// imagesDiv.addEventListener("click", (e) => e.stopPropagation());

// document.addEventListener("click", () => {
//   imagesDiv.classList.remove("active");
//   document.body.classList.remove("active");
// });

// // === Topic click ===
// document.querySelectorAll(".bg-topic").forEach((e) => {
//   e.addEventListener("click", (e) => {
//     imagesList.innerHTML = "";
//     search2.value = e.target.innerHTML;
//     imgQuery = e.target.innerHTML;
//     page = 1;
//     fetchImages();
//   });
// });

// // === Debounce function ===
// function debounce(func, delay) {
//   let timeout;
//   return function (...args) {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => func.apply(this, args), delay);
//   };
// }

// const debouncedFetch = debounce(() => {
//   imagesList.innerHTML = "";
//   page = 1;
//   fetchImages();
// }, 300);

// // === Search input ===
// search2.addEventListener("input", (e) => {
//   imgQuery = e.target.value.trim() || imgQuery;
//   debouncedFetch();
// });

// // === Fetch images function ===
// async function fetchImages() {
//   if (!imagesList) return;

//   try {
//     const res = await fetch(`/images?q=${imgQuery}&page=${page}`, {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//     });

//     if (!res.ok) return;

//     const data = await res.json();

//     data.images.results.forEach((img) => {
//       const li = document.createElement("li");
//       li.className = "li";
//       li.style.position = "relative";

//       const imgEl = document.createElement("img");
//       imgEl.src = img.urls.regular;
//       imgEl.alt = img.alt_description || "Unsplash image";
//       imgEl.crossOrigin = "anonymous";

//       li.appendChild(imgEl);

//       const btnDiv = document.createElement("div");
//       btnDiv.classList.add("select_bnt");

//       const selectBtn = document.createElement("button");
//       selectBtn.textContent = "Select";

//       imgEl.addEventListener("load", () => {
//         selectBtn.addEventListener("click", () => {
//           try {
//             // Set the overlay background image only
//             const bgURL = img.urls.regular || img.urls.full;
//             main.style.backgroundImage = `url(${bgURL})`;

//             // Optionally store in localStorage
//             localStorage.setItem("image", bgURL);
//           } catch (err) {
//             console.error("Error setting overlay background image:", err);
//           }
//         });
//       });

//       btnDiv.appendChild(selectBtn);
//       li.appendChild(btnDiv);

//       imagesList.appendChild(li);
//     });

//     page++;
//   } catch (err) {
//     console.error("Error fetching images:", err);
//   }
// }

// // === Intersection Observer for infinite scroll ===
// const observer = new IntersectionObserver(
//   (entries) => {
//     entries.forEach((entry) => {
//       if (entry.isIntersecting) {
//         fetchImages();
//       }
//     });
//   },
//   {
//     rootMargin: "0px 0px 1000px 0px",
//     threshold: 0.5,
//   }
// );

// if (sentinel) observer.observe(sentinel);

// const hiddenElements = document.querySelectorAll(".hidden");
// hiddenElements.forEach((el) => observer.observe(el));

// // === Remove background image ===
// function removeImage() {
//   bgOverlay.style.backgroundImage = ""; // remove overlay image
//   localStorage.setItem("image", ""); // clear stored image
// }

// // === Initial fetch ===
// fetchImages();

// window.onload = () => {
//   let getImage = localStorage.getItem("image");
//   if (getImage) {
//     main.style.backgroundImage = `url(${getImage})`;
//     main.style.backgroundSize = "100%";
//     main.style.backgroundPosition = "center";
//     main.style.backgroundRepeat = "no-repeat";
//     main.style.backgroundAttachment = "fixed";
//     main.style.backgroundOrigin = "border-box";
//   }
// }