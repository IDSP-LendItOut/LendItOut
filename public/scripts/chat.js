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

const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('messageInput');
    const chatMessages = document.querySelector('.chat-messages');
  
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const text = messageInput.value.trim();
      if (!text) return;
  
      const res = await fetch(window.location.pathname + '/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });
  
      if (res.ok) {
        // Optionally parse new message if returned by backend
        const data = await res.json();
  
        // Append message to chat
        const div = document.createElement('div');
        div.className = 'message sent';
        div.innerText = data.text;
        chatMessages.appendChild(div);
  
        // Scroll to bottom & clear input
        chatMessages.scrollTop = chatMessages.scrollHeight;
        messageInput.value = '';
      } else {
        alert('Failed to send message');
      }
    });
