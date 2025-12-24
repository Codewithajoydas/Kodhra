window.addEventListener("keydown", (e) => {


  if (e.altKey && e.key === "d") {
    e.preventDefault();
    window.location.href = "/";
  } else if (e.altKey && e.key === "s") {
    e.preventDefault();
    window.location.href = "/card";
  } else if (e.altKey && e.key === "f") {
    e.preventDefault();
    window.location.href = "/folder";
  } else if (e.altKey && e.key === "t") {
    e.preventDefault();
    window.location.href = "/tags";
  } else if (e.altKey && e.key === "l") {
    e.preventDefault();
    window.location.href = "/language";
  } else if (e.altKey && e.key === "p") {
    e.preventDefault();
    window.location.href = "/pin";
  } else if (e.altKey && e.key === "v") {
    e.preventDefault();
    window.location.href = "/fav";
  } else if (e.altKey && e.key === "r") {
    e.preventDefault();
    window.location.href = "/draft";
  } else if (e.altKey && e.key === "n") {
    e.preventDefault();
    window.location.href = "/create";
  } else if (e.shiftKey && e.altKey && e.key.toLowerCase() === "f") {
    e.preventDefault();
    document.getElementById("create-folder-modal").classList.add("active");
  } else if (e.altKey && e.key === "u") {
    e.preventDefault();
    window.location.href = "/search";
  } else if (e.altKey && e.key === "e") {
    e.preventDefault();
    window.location.href = "/explore";
  } else if (e.altKey && e.key === "i") {
    e.preventDefault();
    window.location.href = "/import-export";
  } else if (e.altKey && e.key === "g") {
    e.preventDefault();
    window.location.href = "/settings";
  } else if (e.altKey && e.key === "o") {
    e.preventDefault();
    window.location.href = "/profile";
  } else if (e.ctrlKey && e.key === "k") {
    e.preventDefault();
    document.querySelector("#search").focus();
  } else if (e.ctrlKey && e.key === "p") {
    e.preventDefault();
    openProfile(e);
  } else if (e.ctrlKey && e.key === "m") {
    document.querySelector(".music").click();
  } else if (e.ctrlKey && e.key === "h") {
    e.preventDefault();
    window.location.href = "/help";
  } else if (e.altKey && e.key === "b") {
    e.preventDefault();
    document.querySelector(".notification").click();
  } else if (e.altKey && e.key === "q") {
    e.preventDefault();
    document.querySelector(".filter").click();
  } else if (e.altKey && e.key === "1") {
    e.preventDefault();
    document.querySelector("aside").classList.toggle("active");
  } else if (e.altKey && e.key === "0") {
    e.preventDefault();
    applyTheme("dark");
  } else if (e.altKey && e.key === "2") {
    e.preventDefault();
    applyTheme("light");
  } else {
    return;
  }
});
