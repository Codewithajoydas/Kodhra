document.querySelectorAll("[data-tooltip]").forEach((el) => {
  let tooltip = null;

  el.addEventListener("mouseenter", (e) => {
    if (tooltip) {
      tooltip.remove();
      tooltip = null;
    }
    const text = el.dataset.tooltip;
    const hidden = el.dataset.hidden;
    if (e.target !== el) return;

    tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.textContent = text;

    tooltip.style.position = "fixed";
    tooltip.style.zIndex = "9999";
    tooltip.style.pointerEvents = "none";

    document.body.appendChild(tooltip);

    positionTooltip(e);
  });

  el.addEventListener("mousemove", (e) => {
    if (!tooltip) return;
    positionTooltip(e);
  });

  el.addEventListener("mouseleave", () => {
    if (tooltip) {
      tooltip.remove();
      tooltip = null;
    }
  });

  function positionTooltip(e) {
    const offset = 12;

    let x = e.clientX + offset;
    let y = e.clientY + offset;

    const rect = tooltip.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (x + rect.width > vw) {
      x = e.clientX - rect.width - offset;
    }

    if (y + rect.height > vh) {
      y = e.clientY - rect.height - offset;
    }

    if (x < 0) x = 0;

    if (y < 0) y = 0;

    tooltip.style.left = x + "px";
    tooltip.style.top = y + "px";
  }
});
