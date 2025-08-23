function sharebtn(userId, folderId) {
  const hostName = window.location.origin;
  const link = `${hostName}/folder/${userId}/${folderId}`;

  if (navigator.share) {
    navigator
      .share({
        title: "Check out this folder",
        text: "Here’s a link to my shared folder:",
        url: link,
      })
      .then(() => console.log("Shared successfully"))
      .catch((err) => console.error("Share failed:", err));
  } else {
    navigator.clipboard
      .writeText(link)
      .then(() => alert("Copied to clipboard: " + link))
      .catch((err) => console.error("Failed to copy:", err));
  }
}

