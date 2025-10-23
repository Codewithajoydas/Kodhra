function showToast(msg, type) {
  let toast = document.querySelector(".toast");
  toast.textContent = msg;
  toast.classList.add(type);
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 5000);
}