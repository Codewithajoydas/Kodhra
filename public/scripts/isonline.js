let infoDiv = document.getElementById("networkInfo");
infoDiv.textContent = "Checking network status...";
window.addEventListener("offline", () => {
  infoDiv.textContent = "You are offline";
  infoDiv.parentElement.style.display = "flex";
  infoDiv.parentElement.classList.remove("online");
  infoDiv.parentElement.classList.add("offline");
});
window.addEventListener("online", () => {
  infoDiv.textContent = "You are now online";
  infoDiv.parentElement.classList.remove("offline");
  infoDiv.parentElement.classList.add("online");
  let timeout = setInterval(() => {
    infoDiv.parentElement.style.display = "none";
    clearTimeout(timeout);
  }, 5000);
});

