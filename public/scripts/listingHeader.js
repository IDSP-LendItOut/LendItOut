document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.getElementById("menuButton");
  const overlay = document.getElementById("moreOptionsOverlay");
  const closeBtn = document.getElementById("closeMoreOptions");

  if (menuBtn && overlay) {
    menuBtn.addEventListener("click", () => {
      overlay.style.display = "flex";
    });
  }

  if (closeBtn && overlay) {
    closeBtn.addEventListener("click", () => {
      overlay.style.display = "none";
    });
  }

  // close on backdrop click
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.style.display = "none";
    });
  }
});
