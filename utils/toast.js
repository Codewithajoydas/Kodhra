class ShowToast {
  constructor(selector, message, type = "success", duration = 5000) {
    const toast = document.querySelector(selector);
    if (message) {
      if (toast) {
        toast.style.position = "fixed";
        toast.style.bottom = "20px";
        toast.style.right = "20px";
        toast.style.padding = "10px 20px";
        toast.style.borderRadius = "10px";
        toast.style.backdropFilter = "blur(10px)";
        toast.style.background = "rgba(0, 0, 0, 0.5)";
        type === "success"
          ? (toast.style.color = "green")
          : (toast.style.color = "red");
        toast.textContent = message;
        toast.classList.remove("success", "error");
        toast.classList.add(type);
        toast.style.display = "block";
        let timeout = setTimeout(() => {
          toast.style.display = "none";
          clearTimeout(timeout);
        }, duration);
      }
    } else {
      return false;
    }
  }
}

export default ShowToast;