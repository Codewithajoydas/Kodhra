function generateCard(e, img) {
  // main card div
  const cardDiv = document.createElement("div");
  cardDiv.className = "card";
  cardDiv.id = "card-" + e._id;
  cardDiv.ondblclick = () => window.open(`/card/${e._id}`, "_blank");

  // header section
  const headerDiv = document.createElement("div");
  headerDiv.className = "header-info";

  const helperDiv = document.createElement("div");
  helperDiv.style.display = "flex";
  helperDiv.style.alignItems = "center";
  helperDiv.style.gap = "10px";

  const image = document.createElement("img");
  image.src = img;
  image.alt = "";
  image.width = 40;
  image.height = 40;
  image.style.borderRadius = "50%";

  const titleDiv = document.createElement("div");
  titleDiv.className = "title";

  const title = document.createElement("h3");
  title.textContent = e.title;

  const helperDiv1 = document.createElement("div");

  const spanAuthor = document.createElement("span");
  spanAuthor.className = "author";
  const strongtag = document.createElement("strong");
  strongtag.textContent = e.author;
  spanAuthor.appendChild(strongtag);

  const spanLan = document.createElement("span");
  spanLan.className = "lan";
  spanLan.textContent = e.category;

  const spanTime = document.createElement("span");
  spanTime.className = "time";
  spanTime.textContent = new Date(e.metadata.createdAt).toLocaleString();

  helperDiv1.appendChild(spanAuthor);
  helperDiv1.append(", "); // add comma like in EJS
  helperDiv1.appendChild(spanLan);
  helperDiv1.append(", ");
  helperDiv1.appendChild(spanTime);

  titleDiv.appendChild(title);
  titleDiv.appendChild(helperDiv1);

  helperDiv.appendChild(image);
  helperDiv.appendChild(titleDiv);

  const menu_div = document.createElement("div");
  menu_div.className = "menu_top";
  menu_div.onclick = () => toggleMenu(e._id);
  menu_div.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>`;

  headerDiv.appendChild(helperDiv);
  headerDiv.appendChild(menu_div);

  // code section
  const codediv = document.createElement("div");
  codediv.className = "code";
  codediv.title = e.content;
  const codetag = document.createElement("code");
  codetag.innerText = e.content;
  codediv.appendChild(codetag);

  // tags section
  const tagsDiv = document.createElement("div");
  tagsDiv.className = "tags";
  e.tags.forEach((tag) => {
    const tagSpan = document.createElement("span");
    tagSpan.textContent = tag;
    tagsDiv.appendChild(tagSpan);
  });

  // options section
  const optionsDiv = document.createElement("div");
  optionsDiv.className = "options";

  const openButton = document.createElement("div");
  openButton.className = "open";
  const openLink = document.createElement("a");
  openLink.href = `/card/${e._id}`;
  openLink.style.display = "flex";
  openLink.style.justifyContent = "center";
  openLink.style.alignItems = "center";
  openLink.style.gap = "10px";
  openLink.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <line x1="12" x2="12" y1="16" y2="12" />
      <line x1="12" x2="12.01" y1="8" y2="8" />
    </svg>
    View Details`;
  openButton.appendChild(openLink);

  const sub_menu = document.createElement("div");
  sub_menu.className = "sub_menu";

  const pinDiv = document.createElement("div");
  pinDiv.className = "pin";
  pinDiv.onclick = () => pinIt(e._id);
  pinDiv.dataset.id = e._id;
  pinDiv.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 17v5" />
      <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
    </svg>`;
  const favDiv = document.createElement("div");
  favDiv.className = "fav";
  favDiv.onclick = () => favIt(e._id);
  favDiv.dataset.id = e._id;
  favDiv.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    </svg>`;
  sub_menu.appendChild(pinDiv);
  sub_menu.appendChild(favDiv);

  optionsDiv.appendChild(openButton);
  optionsDiv.appendChild(sub_menu);

  // menu section
  const menuDiv = document.createElement("div");
  menuDiv.className = "menu active";
  menuDiv.id = `menu-${e._id}`;
  menuDiv.onclick = () => toggleMenu(e._id);

  const editButton = document.createElement("li");
  editButton.onclick = () => editCard(e._id);
  editButton.textContent = "Edit";

  const deleteButton = document.createElement("li");
  deleteButton.onclick = () => deleteCard(e._id);
  deleteButton.textContent = "Delete";

  const pinButton = document.createElement("li");
  pinButton.onclick = () => pinIt(e._id);
  pinButton.textContent = "Pin";

  menuDiv.appendChild(editButton);
  menuDiv.appendChild(deleteButton);
  menuDiv.appendChild(pinButton);

  // assemble everything
  cardDiv.appendChild(headerDiv);
  cardDiv.appendChild(codediv);
  cardDiv.appendChild(tagsDiv);
  cardDiv.appendChild(optionsDiv);
  cardDiv.appendChild(menuDiv);

  return cardDiv;
}

// Example usage:
// const container = document.querySelector("#cards-container");
// container.appendChild(generateCard(cardData));
