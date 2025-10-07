/**
 * @param {HTMLElement} tagName
 * @returns {HTMLElement}
 */

function tooltip(tagName) {
  document.querySelectorAll(tagName).forEach((e) => {
      e.style.position = "relative";
  })
  document.querySelectorAll(tagName).forEach((e) => {
      e.addEventListener("mouseover", function (e) {
    let tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    if (e.target.closest("[data-tooltip]")) {
      tooltip.innerHTML = e.target.closest("[data-tooltip]").dataset.tooltip;
    }
    document.querySelector(tagName).append(tooltip);
  });
  })
  document.querySelector(tagName).addEventListener("mouseout", function (e) {
    let tooltip = document.querySelector(".tooltip");
    tooltip.remove();
  });
}

export { tooltip };
