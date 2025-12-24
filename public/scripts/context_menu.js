const draftDB1 = indexedDB.open("draftDB", 1);
let db1;

draftDB1.onupgradeneeded = (e) => {
  db1 = e.target.result;
  if (!db1.objectStoreNames.contains("drafts")) {
    db1.createObjectStore("drafts", { keyPath: "id", autoIncrement: true });
  }
};

draftDB1.onsuccess = (e) => {
  db1 = e.target.result;
  window.draft_Delete = function (id) {
    const tx = db1.transaction("drafts", "readwrite");
    const store = tx.objectStore("drafts");
    const deleteRequest = store.delete(Number(id));

    deleteRequest.onsuccess = function () {
      console.log(`Draft ${id} deleted successfully`);
      if (typeof getDraftLen === "function") getDraftLen();
      if (typeof getDrafts === "function") getDrafts();
    };

    deleteRequest.onerror = function (event) {
      console.error("Error deleting draft:", event.target.error);
    };
  };
};

// report, block,  share profile, mute

const icons = {
  delete: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  draft_Delete: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  edit: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-pen-icon lucide-folder-pen"><path d="M2 11.5V5a2 2 0 0 1 2-2h3.9c.7 0 1.3.3 1.7.9l.8 1.2c.4.6 1 .9 1.7.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-9.5"/><path d="M11.378 13.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/></svg>`,
  draft_Edit: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-pen-icon lucide-folder-pen"><path d="M2 11.5V5a2 2 0 0 1 2-2h3.9c.7 0 1.3.3 1.7.9l.8 1.2c.4.6 1 .9 1.7.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-9.5"/><path d="M11.378 13.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/></svg>`,
  rename: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-pen-icon lucide-folder-pen"><path d="M2 11.5V5a2 2 0 0 1 2-2h3.9c.7 0 1.3.3 1.7.9l.8 1.2c.4.6 1 .9 1.7.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-9.5"/><path d="M11.378 13.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/></svg>`,
  move: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-icon lucide-move"><path d="M12 2v20"/><path d="m15 19-3 3-3-3"/><path d="m19 9 3 3-3 3"/><path d="M2 12h20"/><path d="m5 9-3 3 3 3"/><path d="m9 5 3-3 3 3"/></svg>`,
  share: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link-icon lucide-external-link"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`,
  pin: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pin-icon lucide-pin"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>`,
  report: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-warning-icon lucide-message-circle-warning"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`,
  block: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-ban-icon lucide-shield-ban"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m4.243 5.21 14.39 12.472"/></svg>`,
  unblock: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-ban-icon lucide-shield-ban"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m4.243 5.21 14.39 12.472"/></svg>`,
  share_profile: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share2-icon lucide-share-2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>`,
  mute: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-x-icon lucide-message-circle-x"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
  open: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package-open-icon lucide-package-open"><path d="M12 22v-9"/><path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z"/><path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13"/><path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z"/></svg>`,
};

const actions = {
  delete: (card) => deleteFolder(card.dataset.mtype, card.dataset.id),
  draft_Delete: (card) => draft_Delete(card.dataset.id),
  rename: (card) => renameFolder(card.dataset.id),
  move: (card) =>
    moveCard(card.dataset.id, card.dataset.cardname, card.dataset.mtype),
  share: (card) => shareFolder(card.dataset.id, card.dataset.userid),
  pin: (card) => pin(card.dataset.id, card.dataset.mtype),
  edit: (card) => editCard(card.dataset.id, card.dataset.mtype),
  draft_Edit: (card) => draft_Edit(card.dataset.id, card.dataset.url),
  block: (card) => blockUser(card.dataset.targetid, card.dataset.currentid),
  report: (card) => reportUser(card.dataset.targetid, card.dataset.currentid),
  share_profile: (card) =>
    shareProfile(card.dataset.targetid, card.dataset.currentid),
  mute: (card) => muteUser(card.dataset.targetid, card.dataset.currentid),
  open: (card) => openNotebook(card.dataset.id, card.dataset.mtype),
};

actions.unblock = actions.block;

async function blockUser(targetId, currentId) {
  const res = await fetch(`/profile/block/${currentId}/${targetId}`, {
    method: "post",
    credentials: "include",
  });
  const data = await res.json();
  if (res.ok) {
    if (data.message === "unblocked") {
      new Toastmaster({
        title: "Success",
        message: "User Unblocked Successfully",
        type: "success",
        delay: 3000,
      }).showNotification();
    } else if (data.message === "blocked") {
      new Toastmaster({
        title: "Success",
        message: "User Blocked Successfully",
        type: "success",
        delay: 3000,
      }).showNotification();
    } else {
      new Toastmaster({
        title: "Error",
        message: data.message,
        type: "error",
        delay: 3000,
      });
    }
  } else {
    new Toastmaster({
      title: "Error",
      message: "Something went wrong",
      type: "error",
      delay: 3000,
    }).showNotification();
  }
}
async function reportUser(targetId, currentId) {
  new Toastmaster({
    title: "Error!",
    message: "Feature Not Available",
    type: "error",
    delay: 3000,
  }).showNotification();
}
async function shareProfile(targetId, currentId) {
  new Toastmaster({
    title: "Error!",
    message: "Feature Not Available",
    type: "error",
    delay: 3000,
  }).showNotification();
}
async function muteUser(targetId, currentId) {
  new Toastmaster({
    title: "Error!",
    message: "Feature Not Available",
    type: "error",
    delay: 3000,
  }).showNotification();
}

const contextMenu = document.getElementById("context_menu");
const contextMenuList = document.getElementById("context_menu_list");

window.addEventListener("contextmenu", (e) => e.preventDefault());

window.addEventListener("click", () => {
  if (contextMenu) {
    contextMenu.classList.remove("active");
    document.body.classList.remove("active");
  }
});

function openMenu(card, x, y) {
  const menus = card.dataset.menus?.split(",").map((i) => i.trim()) || [];

  contextMenuList.innerHTML = "";

  const cardAuthor = card.dataset.cardauthor;
  const userId = card.dataset.userid;
  const targetId = card.dataset.targetid;
  const isBlocked = card.dataset.isblocked === "true";

  menus.forEach((menuName) => {
    if (cardAuthor !== userId) {
      if (
        menuName === "delete" ||
        menuName === "edit" ||
        menuName === "move" ||
        menuName === "rename"
      ) {
        return;
      }
    }

    if (menuName === "block" && targetId === userId) {
      return;
    }

    let displayName = menuName;
    if (menuName === "block" && isBlocked) {
      displayName = "unblock";
    }

    const li = document.createElement("li");
    li.dataset.action = displayName;
    li.innerHTML = `${icons[displayName] || ""} ${displayName.replace(
      "_",
      " "
    )}`;
    contextMenuList.appendChild(li);

    li.addEventListener("click", (ev) => {
      ev.stopPropagation();

      if (actions[displayName]) {
        actions[displayName](card);
      }

      contextMenu.classList.add("active");
    });
  });

  contextMenu.classList.add("active");

  const menuWidth = contextMenu.offsetWidth;
  const menuHeight = contextMenu.offsetHeight;

  if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 15;
  if (y + menuHeight > window.innerHeight)
    y = window.innerHeight - menuHeight - 5;

  contextMenu.style.left = `${x}px`;
  contextMenu.style.top = `${y}px`;
}

document.addEventListener("contextmenu", (e) => {
  const card = e.target.closest("[data-contextMenu='true']");
  if (!card) return;

  e.preventDefault();
  openMenu(card, e.clientX, e.clientY);
});

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

async function shareFolder(id, userId) {
  try {
    const res = await fetch(`/generate_cdn/${id}`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    if (res.ok) {
      navigator.clipboard.writeText(
        `${window.location.origin}/generate_cdn/${data.link._id}`
      );
      new Toastmaster({
        title: "Success",
        message: "Shared successfully",
        type: "success",
        delay: 5000,
      }).showNotification();
    }
  } catch (err) {
    new Toastmaster({
      title: "Error",
      message: "Failed to share",
      type: "error",
      delay: 5000,
    });
    console.error(err);
  }
}

function openContextMenu(event, clientX = null, clientY = null) {
  event.stopPropagation();

  const card = event.target.closest("[data-contextMenu='true']");
  if (!card) return;

  const cardAuthor = card.dataset.cardauthor;
  const userId = card.dataset.userid;
  const targetId = card.dataset.targetid;
  const isBlocked = card.dataset.isblocked === "true";

  const menus = card.dataset.menus?.split(",").map((i) => i.trim()) || [];
  contextMenuList.innerHTML = "";

  menus.forEach((menuName) => {
    if (cardAuthor !== userId) {
      if (menuName === "delete" || menuName === "edit" || menuName === "move") {
        return;
      }
    }

    if (menuName === "block" && targetId === userId) {
      return;
    }

    let displayName = menuName;
    if (menuName === "block" && isBlocked) {
      displayName = "unblock";
    }

    const li = document.createElement("li");
    li.dataset.action = displayName;

    li.innerHTML = `${icons[displayName] || ""} ${displayName.replace(
      "_",
      " "
    )}`;
    contextMenuList.appendChild(li);

    li.addEventListener("click", (ev) => {
      ev.stopPropagation();

      if (actions[displayName]) {
        actions[displayName](card);
      }

      contextMenu.classList.remove("active");
    });
  });

  let x = clientX ?? event.clientX;
  let y = clientY ?? event.clientY;

  contextMenu.classList.add("active");
  const menuWidth = contextMenu.offsetWidth;
  const menuHeight = contextMenu.offsetHeight;

  if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 15;
  if (y + menuHeight > window.innerHeight)
    y = window.innerHeight - menuHeight - 5;

  contextMenu.style.left = `${x}px`;
  contextMenu.style.top = `${y}px`;
}

window.addEventListener("click", () => {
  if (contextMenu) contextMenu.classList.remove("active");
});

async function favIt(ele, id) {
  try {
    let res = await fetch(`/card/fav/${id}`, {
      method: "put",
    });

    const data = await res.json();
    console.log(data);
    if (res.ok) {
      const likeCount = document.getElementById(`like-count-${id}`);
      let svg = ele.querySelector("svg");
      svg.classList.toggle("active");
      if (svg.classList.contains("active")) {
        likeCount.textContent = parseInt(likeCount.textContent) + 1;
      } else {
        likeCount.textContent = parseInt(likeCount.textContent) - 1;
      }
    }
    if (data.message === "favorited") {
      new Toastmaster({
        title: "Success",
        message: "Card Favorited Successfully",
        type: "success",
        delay: 5000,
      }).showNotification();
    } else if (data.message === "unfavorited") {
      new Toastmaster({
        title: "Success",
        message: "Card Unfavorited Successfully",
        type: "success",
        delay: 5000,
      }).showNotification();
    } else {
      new Toastmaster({
        title: "Error",
        message: "Restore The Card First.",
        type: "error",
        delay: 5000,
      }).showNotification();
    }
  } catch (err) {
    new Toastmaster({
      title: "Error",
      message: "Failed to Favorite.",
      type: "error",
      delay: 5000,
    }).showNotification();
  }
}

async function pinIt(ele, id) {
  try {
    let res = await fetch(`/card/pin/${id}`, {
      method: "put",
    });
    if (res.ok) {
      let svg = ele.querySelector("svg");
      svg.classList.toggle("active");
    }

    const data = await res.json();
    if (data.message === "pinned") {
      new Toastmaster({
        title: "Success",
        message: "Card Pinned Successfully",
        type: "success",
        delay: 5000,
      }).showNotification();
    } else if (data.message === "unpinned") {
      new Toastmaster({
        title: "Success",
        message: "Card Unpinned Successfully",
        type: "success",
        delay: 5000,
      }).showNotification();
    } else {
      new Toastmaster({
        title: "Error",
        message: "Restore The Card First.",
        type: "error",
        delay: 5000,
      }).showNotification();
    }
  } catch (error) {
    console.error(error);
    new Toastmaster({
      title: "Error",
      message: "Failed to pin card",
      type: "error",
      delay: 5000,
    });
  }
}

function editCard(id, mtype) {
  if (mtype === "card") {
    window.location.href = `/card/view/${id}`;
    return;
  }
  window.location.href = `/${mtype}/${id}`;
}

let move_folder = document.querySelector(".move_folder");
let getFoldername = document.querySelector(".header_title .span");

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
    new Toastmaster({
      title: "No folder selected",
      message: "Please select a folder before moving.",
      type: "error",
      delay: 5000,
    }).showNotification();

    return;
  }

  const folderId = selected.value;

  try {
    const res = await fetch(`/moveit/${movetype}/${folderId}/${cardId}`, {
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
      new Toastmaster({
        title: "Move Failed",
        message: `${errorMsg}`,
        type: "error",
        delay: 5000,
      }).showNotification();
    } else {
      new Toastmaster({
        title: "Move Success",
        message: "Card moved successfully.",
        type: "success",
        delay: 5000,
      }).showNotification();
    }
  } catch (err) {
    console.error("Error in moveIt:", err);
    new Toastmaster({
      title: "Move Failed",
      message: "An error occurred while moving the card.",
      type: "error",
      delay: 5000,
    }).showNotification();
  }
}
const mf = document.querySelector(".move_folder");
let isDragging = false;
let offsetX, offsetY;
mf?.addEventListener("mousedown", (e) => {
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
  if (move_folder) move_folder.style.display = "none";
  if (contextMenu) contextMenu.classList.remove("active");
  move_folder?.querySelectorAll("input").forEach((inp) => {
    if (inp.type === "radio" || inp.type === "checkbox") {
      inp.checked = false;
      folderId = null;
    } else {
      inp.value = "";
    }
  });
});
move_folder?.addEventListener("click", (e) => {
  e.stopPropagation();
});
function draft_Edit(id, url) {
  window.location.assign(url);
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".open");

  if (!btn) return;

  const code = btn.dataset.code?.trim();

  if (!code) return;

  navigator.clipboard
    .writeText(code)
    .then(() => {
      const text = btn.querySelector("span");
      text.textContent = "Copied!";
      btn.style.color = "green";
      new Toastmaster({
        title: "Code Copied!",
        message: "Copied Code Successfully",
        type: "success",
        delay: 3000,
      }).showNotification();
      setTimeout(() => {
        btn.style.color = "var(--color)";
        text.textContent = "Copy Code";
      }, 1500);
    })
    .catch(() => {
      new Toastmaster({
        title: "Error!",
        message: "Failed to copy code",
        type: "error",
        delay: 3000,
      }).showNotification();
    });
});

function openNotebook(id, mtype) {
  window.location.href = `/notebook/view/${id}`;
}

async function copy_cdn_link(e) {
  const id = e.target.closest(".card").dataset.id;

  try {
    const res = await fetch(`/generate_cdn/${id}`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    if (res.ok) {
      navigator.clipboard.writeText(
        `${window.location.origin}/generate_cdn/${data.link._id}`
      );
      new Toastmaster({
        title: "Success",
        message: "Link Copied Successfully",
        type: "success",
        delay: 5000,
      }).showNotification();
    }
  } catch (err) {
    new Toastmaster({
      title: "Error",
      message: "Failed to copy link",
      type: "error",
      delay: 5000,
    });
    console.error(err);
  }
}

const elements = document.querySelectorAll("[tabindex='0']");

elements.forEach((el) => {
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      el.click();
    }
  });
});

const createCursor = document.createElement("div");
createCursor.classList.add("cursor");
document.body.appendChild(createCursor);
const cursor = document.querySelector(".cursor");
document.addEventListener("mousemove", (e) => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

async function getTheme() {
  const res = await fetch("/settings/list", {
    method: "GET",
    credentials: "include",
    header: {
      "content-Type": "application/json",
    },
  });
  if (res.ok) {
    const data = await res.json();
    // for theme
    const theme = data.themev2;
    const themeInput = document.querySelector(`input[name='${theme}']`);
    if (themeInput) themeInput.checked = true;
    if (theme === "dark") {
      document.body.setAttribute("data-theme", "dark");
    } else if (theme === "light") {
      document.body.setAttribute("data-theme", "light");
    } else {
      document.body.setAttribute("data-theme", "auto");
    }

    // for font-size
    const fontsizee = data.fontSize;
    document.body.style.fontSize = `${fontsizee}px`;
  }
}

getTheme();
