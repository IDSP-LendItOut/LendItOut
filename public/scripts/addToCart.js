document.addEventListener("DOMContentLoaded", () => {
  
    const addToCartBtn = document.getElementById("addToCartBtn");
    const cartPopup = document.getElementById("cartPopup");
  
    if (addToCartBtn && cartPopup) {
      addToCartBtn.addEventListener("click", () => {
        cartPopup.classList.add("show");
  
        setTimeout(() => {
          cartPopup.classList.remove("show");
        }, 2000);
      });
    } else {
      console.warn("Add to Cart button or popup not found in DOM");
    }
  });
  
  