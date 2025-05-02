"use strict";
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
// login - forgot password btn
document.addEventListener("DOMContentLoaded", () => {
    const forgotLink = document.getElementById("forgot-link");
    const forgotBox = document.getElementById("forgot-password-box");
    const closeBtn = document.getElementById("closeBtn");
    forgotLink.addEventListener("click", () => {
        forgotBox.classList.remove("hidden");
    });
    closeBtn.addEventListener("click", () => {
        forgotBox.classList.add("hidden");
    });
});
// <div id="forgot-password-box" class="forgot-password hidden">
//           <div class="forgot-password-content">
//             <button class="close-btn" id="closeBtn"><i class="fas fa-chevron-left"></i></button>
//             <p>Forgot your Password? Check your email for a link to reset your password</p>
//             <input type="text" id="resetInput" placeholder="Email/Phone Number" />
//             <button class="resend-btn" id="resendEmailBtn">Resend Email</button>
//           </div>
//         </div>
