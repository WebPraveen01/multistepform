
const steps = document.querySelectorAll(".form-step");
const sidebarSteps = document.querySelectorAll(".sidebar .step");
const nextButtons = document.querySelectorAll("button#next-button");

let currentStep = 1;

function showStep(stepNumber) {
  steps.forEach((step, index) => {
    const isActive = index === stepNumber - 1;

    step.hidden = !isActive;
    step.classList.toggle("active", isActive);
  });

  nextButtons.forEach((button) => {
    const isActive = button.closest(".form-step")?.id === `step-${stepNumber}`;
    if (isActive) {
      button.id = "next-button";
    } else {
      button.removeAttribute("id");
    }
  });

  sidebarSteps.forEach((step, index) => {
    step.classList.toggle("active", index === stepNumber - 1);
  });

  currentStep = stepNumber;
}

const nameInput = document.querySelector('input[name="userName"]');
const emailInput = document.querySelector('input[name="email"]');
const phoneInput = document.querySelector('input[name="phone"]');

const nameError = document.querySelector("#name-error");
const emailError = document.querySelector("#email-error");
const phoneError = document.querySelector("#phone-error");

function validatePersonalInfo() {
  let isValid = true;

  nameError.textContent = "";
  emailError.textContent = "";
  phoneError.textContent = "";

  if (nameInput.value.trim() === "") {
    nameError.textContent = "Enter your name";
    isValid = false;
  }

  if (emailInput.value.trim() === "") {
    emailError.textContent = "Enter email";
    isValid = false;
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())
  ) {
    emailError.textContent = "Enter a valid email address";
    isValid = false;
  }

  if (phoneInput.value.trim() === "") {
    phoneError.textContent = "Enter your mobile number";
    isValid = false;
  }

  return isValid;
}


const planCards = document.querySelectorAll(".plan_card");
const planError = document.querySelector("#plan-error");

let selectedPlan = null;

planCards.forEach((card) => {
  card.addEventListener("click", () => {
    planCards.forEach((item) => {
      item.classList.remove("selected");
    });

    card.classList.add("selected");
    selectedPlan = card;

    planError.textContent = "";

    console.log("Selected plan:", selectedPlan.dataset.plan);
  });
});

const billingToggle = document.querySelector("#billing-toggle");
const planPrices = document.querySelectorAll(".plan-price");

billingToggle.addEventListener("change", () => {
  console.log("Yearly checked:", billingToggle.checked);

  // Update plan prices
  planPrices.forEach((price, index) => {
    const card = planCards[index];
    const benefit = card.querySelector(".yearly-benefit");

    if (billingToggle.checked) {
      price.textContent = `$${card.dataset.yearly}/yr`;
      if (benefit) benefit.hidden = false;
    } else {
      price.textContent = `$${card.dataset.monthly}/mo`;
      if (benefit) benefit.hidden = true;
    }
  });

  // Update add-on prices
  addonCards.forEach((card) => {
    const price = card.querySelector(".addon-price");

    if (billingToggle.checked) {
      price.textContent = `+$${card.dataset.yearly}/yr`;
    } else {
      price.textContent = `+$${card.dataset.monthly}/mo`;
    }
  });
});


const addonCards = document.querySelectorAll(".addon_card");

addonCards.forEach((card) => {
  const checkbox = card.querySelector('input[type="checkbox"]');

  card.addEventListener("click", (event) => {
    if (event.target !== checkbox) {
      checkbox.checked = !checkbox.checked;
    }

    card.classList.toggle("selected", checkbox.checked);
  });
});


const backButtons = document.querySelectorAll(".back-button");

backButtons.forEach((button)=>{
    button.addEventListener("click",()=>{
        showStep(currentStep-1)
    })

})

function showSummary() {
  if (selectedPlan === null) {
    showStep(2);
    planError.textContent = "Please select a plan";
    return;
  }

  showStep(4);

  const planName = selectedPlan.dataset.plan;
  const planPrice = billingToggle.checked
    ? selectedPlan.dataset.yearly
    : selectedPlan.dataset.monthly;

  document.querySelector("#summary-plan-name").textContent =
    `${planName} (${billingToggle.checked ? "Yearly" : "Monthly"})`;

  document.querySelector("#summary-plan-price").textContent =
    `$${planPrice}/${billingToggle.checked ? "yr" : "mo"}`;

  // Display selected add-ons
  const summaryAddons = document.querySelector("#summary-addons");
  summaryAddons.innerHTML = "";
  
   let total = Number(planPrice);

  addonCards.forEach((card) => {
    const checkbox = card.querySelector('input[type="checkbox"]');

    if (checkbox.checked) {
      const addonName = card.dataset.addon;
      const addonPrice = billingToggle.checked
        ? card.dataset.yearly
        : card.dataset.monthly;

        total += Number(addonPrice);

      const addonElement = document.createElement("p");
      addonElement.textContent =
        `${addonName} — +$${addonPrice}/${billingToggle.checked ? "yr" : "mo"}`;

      summaryAddons.appendChild(addonElement);
    }
  });
    document.querySelector("#summary-total-price").textContent =
    `$${total}/${billingToggle.checked ? "yr" : "mo"}`;

  document.querySelector("#total-label").textContent =
    `Total (per ${billingToggle.checked ? "year" : "month"})`;
}

document.querySelectorAll("button#next-button").forEach((button) => {
  button.addEventListener("click", () => {
    if (currentStep === 1 && validatePersonalInfo()) {
      showStep(2);
    } else if (currentStep === 2 && selectedPlan !== null) {
      planError.textContent = "";
      showStep(3);
    } else if (currentStep === 2) {
      planError.textContent = "Please select a plan";
    } else if (currentStep === 3) {
      showSummary();
    }
  });
});

showStep(1);


document.querySelector("#change-plan").addEventListener("click", () => {
  showStep(2);

});

document.querySelector("#confirm-button").addEventListener("click", () => {
  steps.forEach((step) => {
    step.hidden = true;
    step.classList.remove("active");
  });

  const thankYouStep = document.querySelector("#step-thank-you");
  thankYouStep.hidden = false;
  thankYouStep.classList.add("active");
});
