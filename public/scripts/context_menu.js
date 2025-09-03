const icons = {
  delete: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  edit: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-pen-icon lucide-folder-pen"><path d="M2 11.5V5a2 2 0 0 1 2-2h3.9c.7 0 1.3.3 1.7.9l.8 1.2c.4.6 1 .9 1.7.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-9.5"/><path d="M11.378 13.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/></svg>`,
  rename: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-pen-icon lucide-folder-pen"><path d="M2 11.5V5a2 2 0 0 1 2-2h3.9c.7 0 1.3.3 1.7.9l.8 1.2c.4.6 1 .9 1.7.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-9.5"/><path d="M11.378 13.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/></svg>`,
  move: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-icon lucide-move"><path d="M12 2v20"/><path d="m15 19-3 3-3-3"/><path d="m19 9 3 3-3 3"/><path d="M2 12h20"/><path d="m5 9-3 3 3 3"/><path d="m9 5 3-3 3 3"/></svg>`,
  share: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link-icon lucide-external-link"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`,
  pin: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pin-icon lucide-pin"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>`,
};
document.querySelectorAll("[data-contextMenu='true']").forEach((item) => {
  item.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    let { id, menus, userid, cardname, mtype } =
      e.currentTarget.dataset;
          console.log(mtype);
    
    const card = e.target.closest("[data-contextMenu='true']");
    if (!card) return;

    const actions = {
      delete: () => deleteFolder(card.dataset.id),
      rename: () => renameFolder(card.dataset.id),
      move: () => moveCard(id, cardname, mtype),
      share: () => shareFolder(card.dataset.id, card.dataset.userid),
      pin: () => pinFolder(card.dataset.id),
    };

    let context_menu = document.getElementById("context_menu");
    let context_menu_list = document.getElementById("context_menu_list");
    context_menu_list.innerHTML = "";

    if (menus) {
      let list = menus.split(",").map((i) => i.trim());
      list.forEach((item) => {
        let li = document.createElement("li");
        li.innerHTML = `${icons[item]}  ${item}`;
        context_menu_list.appendChild(li);

        if (actions[item]) {
          li.addEventListener("click", (ev) => {
            ev.stopPropagation();
            actions[item]();
            context_menu.style.display = "none";
          });
        }
      });
    }
    context_menu.style.display = "block";
    context_menu.style.visibility = "hidden";
    context_menu.style.left = "0px";
    context_menu.style.top = "0px";

    let menuWidth = context_menu.offsetWidth;
    let menuHeight = context_menu.offsetHeight;
    let x = e.clientX;
    let y = e.clientY;

    if (x + menuWidth > window.innerWidth)
      x = window.innerWidth - menuWidth - 5;
    if (y + menuHeight > window.innerHeight)
      y = window.innerHeight - menuHeight - 5;
    context_menu.style.left = x + "px";
    context_menu.style.top = y + "px";
    context_menu.style.visibility = "visible";
    context_menu.style.display = "block";
  });
});

window.addEventListener("click", () => {
  document.getElementById("context_menu").style.display = "none";
});

window.addEventListener("click", () => {
  document.getElementById("context_menu").style.display = "none";
});

function deleteFolder(e) {
  let answer = confirm("Are you sure you want to delete this folder?");
  if (answer) {
    fetch(`/folder/${e}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          window.location.reload();
        } else {
          console.error("Failed to delete folder:", res);
        }
      })
      .catch((err) => {
        console.error("Delete error:", err);
      });
  }
}

function renameFolder(e) {
  let folderName = prompt("Enter the new folder name:");
  if (folderName) {
    fetch(`/folder/${e}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ folderName }),
    })
      .then((res) => {
        if (res.ok) {
          window.location.reload();
        } else {
          console.error("Failed to rename folder:", res);
        }
      })
      .catch((err) => {
        console.error("Rename error:", err);
      });
  }
}
function pinFolder(e) {
  fetch(`/folder/pin/${e}`, {
    method: "PUT",
    credentials: "include",
  })
    .then((res) => {
      if (res.ok) {
        window.location.reload();
      } else {
        console.error("Failed to pin folder:", res);
      }
    })
    .catch((err) => {
      console.error("Pin error:", err);
    });
}
function shareFolder(e, userId) {
  const generateLink = () => {
    const hostName = window.location.origin;
    const link = `${hostName}/folder/${userId}/${e}`;
    return link;
  };

  const link = generateLink();
  navigator.clipboard
    .writeText(link)
    .then(() => alert("Copied to clipboard: " + link))
    .catch((err) => console.error("Failed to copy:", err));
}

