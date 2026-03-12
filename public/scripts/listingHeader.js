document.addEventListener("DOMContentLoaded", function () {
    const menuBtn = document.getElementById("menuButton");
    const modal = document.getElementById("moreOptionsModal");
    const closeBtn = document.getElementById("closeOptionsBtn");

    if (menuBtn && modal && closeBtn) {
      menuBtn.addEventListener("click", () => {
        modal.style.display = "block";
      
      const onScroll = () => {
        modal.style.display = "none";
        window.removeEventListener("scroll", onScroll);
      };

      window.addEventListener("scroll", onScroll);
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
  document.addEventListener("DOMContentLoaded", () => {
    const closeBtn = document.getElementById("closeButton");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        history.back();
      });
    }
  });
  