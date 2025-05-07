document.addEventListener("DOMContentLoaded", function () {
    const menuBtn = document.getElementById("menuButton");
    const modal = document.getElementById("moreOptionsModal");
    const closeBtn = document.getElementById("closeOptionsBtn");

    if (menuBtn && modal && closeBtn) {
      menuBtn.addEventListener("click", () => {
        modal.style.display = "block";
      });

      closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });

      window.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.style.display = "none";
        }
      });
    }
  });