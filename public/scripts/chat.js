document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("options-toggle");
  const optionsMenu = document.getElementById("chat-options");

  if (toggleBtn && optionsMenu) {
    toggleBtn.addEventListener("click", () => {
      optionsMenu.classList.toggle("hidden");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!toggleBtn.contains(e.target) && !optionsMenu.contains(e.target)) {
        optionsMenu.classList.add("hidden");
      }
    });
  }
});

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove("hidden");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  const muteBtn = document.getElementById("mute-btn");
  const blockBtn = document.getElementById("block-btn");
  const deleteBtn = document.getElementById("delete-btn");

  if (muteBtn) muteBtn.addEventListener("click", () => openModal("mute-modal"));
  if (blockBtn) blockBtn.addEventListener("click", () => openModal("block-modal"));
  if (deleteBtn) deleteBtn.addEventListener("click", () => openModal("delete-modal"));
});
