const chips = document.querySelectorAll(".chip");

chips.forEach((ele) => {
  ele.addEventListener("click", () => {
    chips.forEach((e) => e.classList.remove("active"));
    ele.classList.add("active");

    const query = encodeURIComponent(ele.textContent);

    if (query === "All") {
      filteredData().then((data) => {
        document.querySelector("#cards").innerHTML = "";
        document.querySelector("#cards").insertAdjacentHTML("beforeend", data);
      });
    } else {
      filteredData(query).then((data) => {
        document.querySelector("#cards").innerHTML = "";
        document.querySelector("#cards").insertAdjacentHTML("beforeend", data);
      });
    }
  });
});

async function filteredData(search = "") {

  let res = await fetch(`/card/json?search=${search}`);
  if (!res.ok) {
    return `<span> No Snippets Found</span>`;
  }
  let data = await res.text();
  return data;
}
