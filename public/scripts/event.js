// home - buying/renting filter
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".tab-buttons button");
  const content = document.getElementById("content");

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const tab = button.id === "buyingBtn" ? "buying" : "renting";
      const res = await fetch(`/${tab}`);
      const html = await res.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const newContent = doc.getElementById("content")?.innerHTML;

      if (newContent && content) {
        content.innerHTML = newContent;
      }

      const seeAllLink = document.getElementById("link");

      if (seeAllLink) {
        seeAllLink.href = tab === "buying" ? "/buying-page" : "/renting-page";
      }
    });
  });
});

// profile - btn groups
document.addEventListener("DOMContentLoaded", () => {
  const buttonContainer = document.getElementById("profile-btns");

  buttonContainer?.addEventListener("click", (e) => {
    const target = e.target;

    const button = target.closest("button[data-route]");

    if (button) {
      const route = button.getAttribute("data-route");
      if (route) {
        window.location.href = `profile${route}`;
        // window.location.href = route;
      }
    }
  });
});

// // forgot-password
document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("backBtn");
  const inputs = document.querySelectorAll(".codeBox");

  backBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "/auth/forgot-password";
  });

  inputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      const value = e.target.value;
      if (value.length === 1 && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && index > 0) {
        inputs[index - 1].focus();
      }
    });
  });
});
