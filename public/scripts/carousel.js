document.addEventListener('DOMContentLoaded', function () {
  const jsonTag = document.getElementById('carouselData');
  const mainImage = document.getElementById('mainImage');
  const dots = document.querySelectorAll('#carouselDots .dot');

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

  // 🔁 Autoplay every 3 seconds
  setInterval(() => {
    const nextIndex = (currentIndex + 1) % images.length;
    updateCarousel(nextIndex);
  }, 3000);
});
