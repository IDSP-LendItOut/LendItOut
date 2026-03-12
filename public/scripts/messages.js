document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.querySelector('.message-box button');
    const input = document.querySelector('.message-box input');
  
    if (sendBtn && input) {
      sendBtn.addEventListener('click', () => {
        input.value = '';
      });
    }
  });
  