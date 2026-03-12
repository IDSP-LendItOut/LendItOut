const slides = document.querySelectorAll('.onboarding-slide');
const dots = document.querySelectorAll('.dot');
const prev = document.getElementById('prev');
const next = document.getElementById('next');

let current = 0;

function updateSlides() {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === current);
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === current);
  });

  prev.style.display = current === 0 ? 'none' : 'inline-block';
  next.style.display = current === slides.length - 1 ? 'none' : 'inline-block';
}

prev.addEventListener('click', () => {
  if (current > 0) {
    current--;
    updateSlides();
  }
});

next.addEventListener('click', () => {
  if (current < slides.length - 1) {
    current++;
    updateSlides();
  }
});

updateSlides();
