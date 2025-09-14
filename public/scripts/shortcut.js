window.addEventListener("keydown", (e) => {
  if (e.altKey && e.key === "n") {
    e.preventDefault();
    window.location.assign("/card/create");
  }
  if (e.altKey && e.key === "s") {
    e.preventDefault();
    window.location.assign("/settings");
  }
  if (e.altKey && e.key === "a") {
    e.preventDefault();
    window.location.assign("/card");
  }
  if (e.altKey && e.key === "d") {
    e.preventDefault();
    window.location.assign("/folder");
  }
  if (e.altKey && e.key === "t") {
    e.preventDefault();
    window.location.assign("/tags");
  }
  if (e.altKey && e.key === "p") {
    e.preventDefault();
    window.location.assign("/pin");
  }
  if (e.altKey && e.key === "f") {
    e.preventDefault();
    window.location.assign("/fav");
  }
  if (e.ctrlKey && e.key === "r") {
    e.preventDefault();
    window.location.reload();
  }
  if (e.key === "Escape") {
    e.preventDefault();
    let rs = document.querySelector(".results");
    rs.classList.remove("active");
    document.querySelector("input").value = "";
  }
});

const clickSound = new Audio("assets/sound/computer-mouse-click-352734.mp3");
clickSound.volume = 0.3;
clickSound.preload = "auto";
document.addEventListener("mousedown", (e) => {
  clickSound.currentTime = 0;
  clickSound.play();
});

