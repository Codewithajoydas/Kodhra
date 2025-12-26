async function getUserDetails() {
  try {
    const res = await fetch("/a");
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

getUserDetails().then((a) => {
  localStorage.setItem(
    "data",
    btoa(unescape(encodeURIComponent(JSON.stringify(a))))
  );
});

const draftDB = indexedDB.open("draftDB", 1);
let db;
let currentObjectId = null;

draftDB.onupgradeneeded = function () {
  db = draftDB.result;
  db.createObjectStore("drafts", { keyPath: "id", autoIncrement: true });
};

draftDB.onsuccess = (e) => {
  db = e.target.result;

  const saveDraft = (db) => {
    const tx = db.transaction("drafts", "readwrite");
    const store = tx.objectStore("drafts");
    const titleEl = document.getElementById("title1")?.value ?? "";
    const folderEl = document.getElementById("folderName1")?.value ?? "";
    const desEl = document.getElementById("des")?.value ?? "";
    const catEl = document.getElementById("category")?.value ?? "";
    const tagEl = document.getElementById("tags")?.value?.split(",") ?? [];
    const codeEL = editor?.getValue() ?? "";
    if (!codeEL) return;

    if (currentObjectId) {
      const request = store.put({
        id: currentObjectId,
        title: titleEl,
        folder: folderEl,
        description: desEl,
        category: catEl,
        tags: tagEl,
        code: codeEL,
        content: codeEL,
        author: JSON.parse(
          atob(unescape(encodeURIComponent(localStorage.getItem("data"))))
        ),
      });
      request.onsuccess = () => console.log("Draft saved successfully");
      request.onerror = () => console.log("Error saving draft");
      return;
    } else {
      const request = store.add({
        title: titleEl,
        folder: folderEl,
        description: desEl,
        category: catEl,
        tags: tagEl,
        code: codeEL,
        content: codeEL,
        author: JSON.parse(
          atob(unescape(encodeURIComponent(localStorage.getItem("data"))))
        ),
        createdAt: new Date().toLocaleString(),
      });

      request.onsuccess = () => {
        currentObjectId = request.result;
        console.log("Draft saved successfully");
      };
      request.onerror = () => console.log("Error saving draft");
    }
  };
  async function getSaveInterval() {
    const res = await fetch("/settings/list", {
      method: "GET",
      credentials: "include",
      headers: {
        "content-Type": "application/json",
      },
    });
    if (res.ok) {
      const data = await res.json();
      const intervalTime = data.autoSaveInterval;
      if (intervalTime) {
        setInterval(() => {
          saveDraft(db);
        }, parseInt(intervalTime) * 1000);
      }
    }
  }
  getSaveInterval();
  window.onbeforeunload = () => {
    if (db) saveDraft(db);
  };

  function getDraftLen() {
    return new Promise((resolve, reject) => {
      const tx = db.transaction("drafts", "readonly");
      const store = tx.objectStore("drafts");
      const request = store.count();

      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }
  getDraftLen().then((len) => {
    let el = document.querySelector(".draft");
    if (el) {
      el.textContent = len;
    }
  });

  function getDrafts(db) {
    const tx = db.transaction("drafts", "readonly");
    const store = tx.objectStore("drafts");
    const request = store.getAll();
    request.onsuccess = () => {
      const cards = document.getElementById("cards1");
      const drafts = request.result;
      const cardss = drafts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      if (cardss.length === 0) {
        cards.innerHTML = `<div class="no-data" style="display:flex; width: 100%; justify-content: center; align-items: center;flex-direction: column; z-index: 9999999999;">
  <p style="font-size: 1.5em; font-weight: bold;">No Data Found</p>
  <p>Create a snippet to get started</p>
</div>`;
        return;
      }

      cards.innerHTML = "";
      cardss.forEach((card) => {
        const cardHTML = `
   <div class="card"
     tabindex="0"
     data-menus="draft_Delete, draft_Edit"
     data-userId="${card.author}"
     data-contextMenu="true"
     data-cardName="${card.title}"
     data-mtype="card"
     data-id="${card.id}"
     data-url = "/card/create?${new URLSearchParams({
       title: card.title,
       id: card.id,
       author: card.author,
       description: card.description,
       content: card.content,
       category: card.category,
       tags: card.tags,
       userImage: card.userImage,
       authorName: card.authorName,
     }).toString()}"
     ondblclick="window.location.href = this.dataset.url"
     data-cardauthor="${card.author}">
     
    <div class="header-info">
        <label for="card_${
          card.id
        }" style="display: flex; align-items: center; gap: 10px">
            <img src="${
              card.userImage && card.userImage.trim()
                ? card.userImage
                : "https://static.vecteezy.com/system/resources/previews/013/360/247/non_2x/default-avatar-photo-icon-social-media-profile-sign-symbol-vector.jpg"
            }"
             onerror="this.src='https://static.vecteezy.com/system/resources/previews/013/360/247/non_2x/default-avatar-photo-icon-social-media-profile-sign-symbol-vector.jpg'" 
             alt="" width="40" height="40" style="border-radius: 50%" />
            <div class="title">
                <h3>
                    ${card.title?.trim() || "Untitled"}
                    <span style="font-size: 13px !important; display: block">
                        ${card.description?.trim() || "No description"}
                    </span>
                </h3>
                <div>
                    <span class="author"><strong>${
                      card.authorName?.trim() || "Unknown"
                    }</strong></span>,
                    <span class="lan">${
                      card.category?.trim() || "Uncategorized"
                    }</span>,
                    <span class="time">${new Date(
                      card.createdAt ?? new Date()
                    ).toLocaleString()}</span>
                </div>
            </div>
        </label>

        <div class="menu_top"
             data-id="${card.id}"
             onclick="openContextMenu(event)"
             data-userId="${card.author}"
             data-cardauthor="${card.author}"
             data-cardName="${card.title}"
             data-mtype="card"
             data-url = "/card/create?${new URLSearchParams({
               title: card.title,
               id: card.id,
               author: card.author,
               description: card.description,
               content: card.content,
               category: card.category,
               tags: card.tags,
               userImage: card.userImage,
               authorName: card.authorName,
             }).toString()}"
             data-menus="draft_Delete, draft_Edit"
             data-contextMenu='true'
             tabindex="0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="lucide lucide-ellipsis-vertical">
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
            </svg>
        </div>
    </div>

    <div class="code" title="${card.content?.trim() || "No content"}">
        <code>${card.content?.trim() || "No content"}</code>
    </div>

    ${
      (card.tags ?? []).length > 0
        ? `<div class="tags">
             ${(card.tags ?? [])
               .map(
                 (tag) =>
                   `<a class="span" href="search?query=${tag}">${
                     tag?.trim() ?? "Tag"
                   }</a>`
               )
               .join("")}
           </div>`
        : ""
    }

    <div class="options">
        <div class="open" tabindex="0">
            <a href="/card/${card.id ?? ""}" 
               style="display: flex; justify-content: center; align-items: center; gap: 10px; background: var(--accent);">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="lucide lucide-badge-info">
                    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                    <line x1="12" x2="12" y1="16" y2="12" />
                    <line x1="12" x2="12.01" y1="8" y2="8" />
                </svg>
                View Details
            </a>
        </div>
    </div>
</div>`;
        if (cards) {
          cards.innerHTML += cardHTML;
        }
      });
    };
  }

  getDrafts(db);
};
