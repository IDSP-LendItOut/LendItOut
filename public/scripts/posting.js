document.addEventListener("DOMContentLoaded", () => {
  const form1 = document.getElementById("step1-form");
  const form4 = document.getElementById("step4-form");
  const nextBtn = document.getElementById("posting-next");
  const backBtn = document.getElementById("posting-back");
  const postBtn = document.getElementById("post-btn");
  const confirmationOverlay = document.getElementById("confirmationOverlay");
  const backToHomeBtn = document.getElementById("backToHomeButton");

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

  // postBtn.addEventListener("click", (e) => {
  //   e.preventDefault();

  //   confirmationOverlay.classList.remove("hidden");
  // });

  backToHomeBtn.addEventListener("click", (e) => {
    window.location.href = "/";
  });

  form4.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    console.log(formData);
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (response.ok) {
        confirmationOverlay.classList.remove("hidden");
      } else {
        alert("There was an issue creating the listing. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An unexpected error occurred.");
    }
  });
});
