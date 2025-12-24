async function getSettings() {
  const res = await fetch("/settings/list", {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  return data;
}


