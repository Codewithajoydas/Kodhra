window.onbeforeunload = () => {
  if (navigator.sendBeacon) {
    const payload = JSON.stringify({ lastActive: Date.now() });
    navigator.sendBeacon("/lastactive", payload);
  }
};
