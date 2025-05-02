document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.onboarding-slide');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');

  let current = 0;

  function updateSlides() {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === current);
    });

    prevBtn.style.display = current === 0 ? 'none' : 'inline-block';
    nextBtn.style.display = current === slides.length - 1 ? 'none' : 'inline-block';
  }

  prevBtn.addEventListener('click', () => {
    if (current > 0) {
      current--;
      updateSlides();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (current < slides.length - 1) {
      current++;
      updateSlides();
    }
  });

  updateSlides();
});
