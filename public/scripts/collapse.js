function collapse(titleEl) {
  const overview = titleEl.nextElementSibling;
  overview.classList.toggle("collapse");
  const arrow = titleEl.querySelector(".down");
  arrow.classList.toggle("active");
}
