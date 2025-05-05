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

      const seeAllLink = document.getElementById("link") as HTMLAnchorElement;

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
    const target = e.target as HTMLElement;

    const button = target.closest("button[data-route]") as HTMLButtonElement;

    if (button) {
      const route = button.getAttribute("data-route");
      if (route) {
        window.location.href = `profile${route}`;
        // window.location.href = route;
      }
    }
  });
});

// login - forgot password btn
document.addEventListener("DOMContentLoaded", () => {
  const forgotLink = document.getElementById("forgot-link") as HTMLElement;
  const forgotBox = document.getElementById(
    "forgot-password-box"
  ) as HTMLElement;
  const forgotBox2 = document.getElementById(
    "forgot-password-box2"
  ) as HTMLElement;
  const closeBtn = document.getElementById("closeBtn") as HTMLElement;
  const sendBtn = document.getElementById("sendCodeBtn") as HTMLElement;
  const backBtn = document.getElementById("backBtn") as HTMLElement;
  const enterBtn = document.getElementById("enterBtn") as HTMLElement;

  forgotLink.addEventListener("click", function (e) {
    e.preventDefault();
    forgotBox.classList.remove("hidden");
  });

  closeBtn.addEventListener("click", function () {
    forgotBox.classList.add("hidden");
  });

  sendBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const userInput = (
      document.getElementById("resetInput") as HTMLInputElement
    )?.value;
    if (userInput) {
      const response = await fetch("/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userInput }),
      });
      if (response.ok) {
        forgotBox.classList.add("hidden");
        forgotBox2.classList.remove("hidden");
      }
    }
  });

  backBtn.addEventListener("click", (e) => {
    e.preventDefault();
    forgotBox.classList.remove("hidden");
    forgotBox2.classList.add("hidden");
  });

  enterBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "/auth/password-reset";
  });
});
