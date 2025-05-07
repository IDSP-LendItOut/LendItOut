document.addEventListener("DOMContentLoaded", () => {
  const form1 = document.getElementById("step1-form");
  const form2 = document.getElementById("step2-form");
  const nextBtn = document.getElementById("posting-next");
  const backBtn = document.getElementById("posting-back");

  // Back button handling
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      const params = new URLSearchParams(window.location.search);
      const currentStep = parseInt(params.get("step") || "1", 10);
      const prevStep = Math.max(currentStep - 1, 1);
      if (currentStep === 1) {
        window.location.href = `/`;
      } else {
        window.location.href = `/posting/create?step=${prevStep}`;
      }
    });
  }

  if (form1) {
    form1.addEventListener("submit", (event) => {
      const checkboxes = form.querySelectorAll('input[name="type"]');
      const category = form.querySelector('input[name="category"]:checked');

      const isTypeChecked = [...checkboxes].some(
        (checkbox) => checkbox.checked
      );
      if (!isTypeChecked) {
        event.preventDefault();
        alert("Please select at least one listing type.");
        return;
      }

      if (!category) {
        event.preventDefault();
        alert("Please select a category.");
        return;
      }
    });
  }
});
