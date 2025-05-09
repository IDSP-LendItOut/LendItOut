document.addEventListener('DOMContentLoaded', function () {
  const jsonTag = document.getElementById('carouselData');
  const mainImage = document.getElementById('mainImage');
  const dots = document.querySelectorAll('#carouselDots .dot');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const menuButton = document.querySelector('.buy-header .menu');
  const modal = document.querySelector('.more-options-modal');
  const closeButton = document.querySelector('.more-options-modal .close-icon');

  if (!jsonTag || !mainImage) return;

  let images = [];
  try {
    images = JSON.parse(jsonTag.textContent);
  } catch (err) {
    console.error("JSON parse error", err);
    return;
  }

  let currentIndex = 0;

  function updateCarousel(index) {
    if (!images.length) return;

    currentIndex = index;
    mainImage.src = images[currentIndex].url;

    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[currentIndex]) {
      dots[currentIndex].classList.add('active');
    }
  }

  // Dot click
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.index);
      if (!isNaN(index)) updateCarousel(index);
    });
  });

  // Arrows
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const prevIndex = (currentIndex - 1 + images.length) % images.length;
      updateCarousel(prevIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const nextIndex = (currentIndex + 1) % images.length;
      updateCarousel(nextIndex);
    });
  }

  // Optional: autoplay
  // setInterval(() => {
  //   const nextIndex = (currentIndex + 1) % images.length;
  //   updateCarousel(nextIndex);
  // }, 3000);

  // Modal toggle
  if (menuButton && modal) {
    menuButton.addEventListener('click', () => {
      modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
    });
  }

  if (closeButton) {
    closeButton.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  // Close modal on outside click
  window.addEventListener('click', (e) => {
    if (modal && !modal.contains(e.target) && !menuButton.contains(e.target)) {
      modal.style.display = 'none';
    }
  });
});
