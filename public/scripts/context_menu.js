const icons = {
  delete: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  edit: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-pen-icon lucide-folder-pen"><path d="M2 11.5V5a2 2 0 0 1 2-2h3.9c.7 0 1.3.3 1.7.9l.8 1.2c.4.6 1 .9 1.7.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-9.5"/><path d="M11.378 13.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/></svg>`,
  rename: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-pen-icon lucide-folder-pen"><path d="M2 11.5V5a2 2 0 0 1 2-2h3.9c.7 0 1.3.3 1.7.9l.8 1.2c.4.6 1 .9 1.7.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-9.5"/><path d="M11.378 13.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/></svg>`,
  move: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-icon lucide-move"><path d="M12 2v20"/><path d="m15 19-3 3-3-3"/><path d="m19 9 3 3-3 3"/><path d="M2 12h20"/><path d="m5 9-3 3 3 3"/><path d="m9 5 3-3 3 3"/></svg>`,
  share: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link-icon lucide-external-link"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`,
  pin: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pin-icon lucide-pin"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>`,
};
const actions = {
  delete: (card) => deleteFolder(card.dataset.mtype, card.dataset.id),
  rename: (card) => renameFolder(card.dataset.id),
  move: (card) =>
    moveCard(card.dataset.id, card.dataset.cardname, card.dataset.mtype),
  share: (card) => shareFolder(card.dataset.id, card.dataset.userid),
  pin: (card) => pin(card.dataset.id, card.dataset.mtype),
  edit: (card) => editCard(card.dataset.id, card.dataset.mtype),
};

// Context menu DOM
const contextMenu = document.getElementById("context_menu");
const contextMenuList = document.getElementById("context_menu_list");

// Prevent default browser menu on custom menu
contextMenu.addEventListener("contextmenu", (e) => e.preventDefault());

// Global click listener to hide menu
window.addEventListener("click", () => {
  contextMenu.style.display = "none";
  document.body.classList.remove("active");
});

// Open menu function (reusable)
function openMenu(card, x, y) {
  const menus = card.dataset.menus?.split(",").map((i) => i.trim()) || [];

  contextMenuList.innerHTML = "";
  const cardAuthor = card.dataset.cardauthor;
  const userId = card.dataset.userid;
  menus.forEach((name) => {
    if (cardAuthor !== userId) {
      if (name === "delete" || name === "edit" || name === "move") {
        return;
      }
    }
    const li = document.createElement("li");
    li.innerHTML = `${icons[name] || ""} ${name}`;
    contextMenuList.appendChild(li);

    if (actions[name]) {
      li.addEventListener("click", (ev) => {
        ev.stopPropagation();
        actions[name](card);
        contextMenu.style.display = "none";
      });
    }
  });

  // Position menu with edge detection
  contextMenu.style.visibility = "hidden";
  contextMenu.style.display = "block";
  let menuWidth = contextMenu.offsetWidth;
  let menuHeight = contextMenu.offsetHeight;

  if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 5;
  if (y + menuHeight > window.innerHeight)
    y = window.innerHeight - menuHeight - 5;

  contextMenu.style.left = `${x}px`;
  contextMenu.style.top = `${y}px`;
  contextMenu.style.visibility = "visible";
}

// Right-click listener for all cards
document.addEventListener("contextmenu", (e) => {
  const card = e.target.closest("[data-contextMenu='true']");
  if (!card) return;

  e.preventDefault();
  openMenu(card, e.clientX, e.clientY);
});

// Example usage:
// <button onclick="openContextMenu(event)">Menu</button> inside each card

// --- Folder Actions ---
function deleteFolder(type, id) {
  if (confirm(`Are you sure you want to delete this ${type}?`)) {
    fetch(`/delete/${type}/${id}`, { method: "DELETE", credentials: "include" })
      .then((res) => res.ok && window.location.reload())
      .catch(console.error);
  }
}

function renameFolder(id) {
  const folderName = prompt("Enter the new folder name:");
  if (!folderName) return;
  fetch(`/folder/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ folderName }),
  })
    .then((res) => res.ok && window.location.reload())
    .catch(console.error);
}

function pin(id, type) {
  fetch(`/${type}/pin/${id}`, { method: "PUT", credentials: "include" })
    .then((res) => res.ok && window.location.reload())
    .catch(console.error);
}

function shareFolder(id, userId) {
  const link = `${window.location.origin}/folder/${userId}/${id}`;
  navigator.clipboard
    .writeText(link)
    .then(() => alert("Copied to clipboard: " + link))
    .catch(console.error);
}

function openContextMenu(event, clientX = null, clientY = null) {
  event.stopPropagation();
  const card = event.target.closest("[data-contextMenu='true']");
  const cardAuthor = card.dataset.cardauthor;
  const userId = card.dataset.userid;
  if (!card) return;
  const menus = card.dataset.menus?.split(",").map((i) => i.trim()) || [];
  contextMenuList.innerHTML = "";
  menus.forEach((name) => {
    if (cardAuthor !== userId) {
      if (name === "delete" || name === "edit" || name === "move") {
        return;
      }
    }
    const li = document.createElement("li");
    li.innerHTML = `${icons[name] || ""} ${name}`;
    contextMenuList.appendChild(li);
    if (actions[name]) {
      li.addEventListener("click", (ev) => {
        ev.stopPropagation();
        actions[name](card);
        contextMenu.style.display = "none";
      });
    }
  });
  contextMenu.style.display = "block";
  let x = clientX ?? event.clientX;
  let y = clientY ?? event.clientY;
  let menuWidth = contextMenu.offsetWidth;
  let menuHeight = contextMenu.offsetHeight;
  if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 5;
  if (y + menuHeight > window.innerHeight)
    y = window.innerHeight - menuHeight - 5;
  contextMenu.style.left = `${x}px`;
  contextMenu.style.top = `${y}px`;
}

window.addEventListener("click", () => {
  contextMenu.style.display = "none";
});

async function favIt(ele, id) {
  let res = await fetch(`/card/fav/${id}`, {
    method: "put",
  });
  if (res.ok) {
    let svg = ele.querySelector("svg");
    svg.classList.toggle("active");
  }
  res.json().then((data) => {});
}
async function pinIt(ele, id) {
  let res = await fetch(`/card/pin/${id}`, {
    method: "put",
  });
  if (res.ok) {
    let svg = ele.querySelector("svg");
    svg.classList.toggle("active");
  }
  res.json().then((data) => {});
}

function editCard(id) {
  window.location.href = `/card/${id}`;
}

let move_folder = document.querySelector(".move_folder");
let getFoldername = document.querySelector(".header_title .span");
const toast = document.querySelector(".toast");
const toastCloseBtn = document.querySelector(".toast .close");
const toastMessage = document.querySelector(".toast-message");
let toastTimeoutId = null;

function showToast(message, type = "success", duration = 5000) {
  if (toastTimeoutId) clearTimeout(toastTimeoutId);
  toastMessage.textContent = message;
  toast.dataset.type = type;
  toast.style.display = "block";
  toastTimeoutId = setTimeout(() => {
    toast.style.display = "none";
    toastTimeoutId = null;
  }, duration);
}
toastCloseBtn.addEventListener("click", () => {
  toast.style.display = "none";
  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId);
    toastTimeoutId = null;
  }
});

async function moveCard(id, cardName, mtype) {
  cardId = id;
  movetype = mtype;
  getFoldername.textContent = `Move \"${cardName}\" :`;
  move_folder.style.display = "block";
  move_folder.style.visibility = "visible";
}

async function moveIt() {
  const selected = document.querySelector("input[name='moveFolder']:checked");
  if (!selected) {
    showToast("⚠️ Please select a folder before moving.", "error");
    return;
  }

  const folderId = selected.value;

  try {
    const res = await fetch(`moveit/${movetype}/${folderId}/${cardId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      let errorMsg = "Move failed. Please try again.";
      try {
        const data = await res.json();
        if (data?.error) errorMsg = data.error;
      } catch {}
      showToast(`🚨 ${errorMsg}`, "error");
    } else {
      showToast(`🎉 Successfully moved ${movetype}!`, "success");
    }
  } catch (err) {
    console.error("Error in moveIt:", err);
    showToast("🚨 Unexpected error. Please check your connection.", "error");
  }
}
const mf = document.querySelector(".move_folder");
let isDragging = false;
let offsetX, offsetY;
mf.addEventListener("mousedown", (e) => {
  e.preventDefault();
  isDragging = true;
  offsetX = e.clientX - mf.offsetLeft;
  offsetY = e.clientY - mf.offsetTop;
  mf.style.position = "absolute";
  mf.style.zIndex = 1000;
});
document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  mf.style.left = e.clientX - offsetX + "px";
  mf.style.top = e.clientY - offsetY + "px";
});
document.addEventListener("mouseup", () => {
  isDragging = false;
});

document.addEventListener("click", () => {
  document.querySelector("body").classList.remove("active");
  move_folder.style.display = "none";
  context_menu.style.display = "none";
  move_folder.querySelectorAll("input").forEach((inp) => {
    if (inp.type === "radio" || inp.type === "checkbox") {
      inp.checked = false;
      folderId = null;
    } else {
      inp.value = "";
    }
  });
});
move_folder.addEventListener("click", (e) => {
  e.stopPropagation();
});
