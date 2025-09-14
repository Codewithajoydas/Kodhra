let notificationBar = document.querySelector(".notification-bar");
notificationBar.addEventListener("click", (e) => {
  e.stopPropagation();
});
let notificationlist = document.querySelectorAll(".notification-list");
let n_openerBtn = document.querySelector(".notification");
n_openerBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  notificationBar.classList.toggle("active");
  document.querySelector("body").classList.toggle("active");
  notificationlist.forEach((e) => {
    e.classList.toggle("active");
  });
  // readmsg();
});
document.addEventListener("click", () => {
  notificationBar.classList.remove("active");
  document.querySelector("body").classList.remove("active");

  notificationlist.forEach((e) => {
    e.classList.remove("active");
  });
});
