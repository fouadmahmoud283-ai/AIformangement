// DOM Elements
const form = document.getElementById("signup-form");
const emailInput = document.getElementById("email");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const termsCheckbox = document.getElementById("terms");
const submitBtn = document.querySelector(".submit-btn");
const btnText = document.querySelector(".btn-text");
const btnLoading = document.querySelector(".btn-loading");
const successMessage = document.getElementById("success-message");

// Error message elements
const emailError = document.getElementById("email-error");
const usernameError = document.getElementById("username-error");
const passwordError = document.getElementById("password-error");
const confirmPasswordError = document.getElementById("confirm-password-error");
const termsError = document.getElementById("terms-error");

// Password requirement elements
const lengthReq = document.getElementById("length-req");
const uppercaseReq = document.getElementById("uppercase-req");
const lowercaseReq = document.getElementById("lowercase-req");
const numberReq = document.getElementById("number-req");
const specialReq = document.getElementById("special-req");

// Password toggle buttons
const passwordToggles = document.querySelectorAll(".password-toggle");

// Validation state
const validationState = {
  email: false,
  username: false,
  password: false,
  confirmPassword: false,
  terms: false,
};

// Utility functions
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const showError = (element, message) => {
  element.textContent = message;
  element.parentElement.querySelector(".form-input")?.classList.add("error");
};

const clearError = (element) => {
  element.textContent = "";
  element.parentElement.querySelector(".form-input")?.classList.remove("error");
};

const updateSubmitButton = () => {
  const allValid = Object.values(validationState).every((valid) => valid);
  submitBtn.disabled = !allValid;
};

// Email validation
const validateEmail = (email) => {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

const checkEmail = () => {
  const email = emailInput.value.trim();

  if (!email) {
    showError(emailError, "Email address is required");
    validationState.email = false;
  } else if (!validateEmail(email)) {
    showError(emailError, "Please enter a valid email address");
    validationState.email = false;
  } else {
    clearError(emailError);
    validationState.email = true;
  }

  updateSubmitButton();
};

// Username validation
const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  return (
    usernameRegex.test(username) &&
    username.length >= 3 &&
    username.length <= 20
  );
};

const checkUsername = () => {
  const username = usernameInput.value.trim();

  if (!username) {
    showError(usernameError, "Username is required");
    validationState.username = false;
  } else if (username.length < 3) {
    showError(usernameError, "Username must be at least 3 characters long");
    validationState.username = false;
  } else if (username.length > 20) {
    showError(
      usernameError,
      "Username must be no more than 20 characters long",
    );
    validationState.username = false;
  } else if (!validateUsername(username)) {
    showError(
      usernameError,
      "Username can only contain letters, numbers, underscores, and hyphens",
    );
    validationState.username = false;
  } else {
    clearError(usernameError);
    validationState.username = true;
  }

  updateSubmitButton();
};

// Password validation
const checkPasswordStrength = (password) => {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  return requirements;
};

const updatePasswordRequirements = (requirements) => {
  lengthReq.classList.toggle("valid", requirements.length);
  uppercaseReq.classList.toggle("valid", requirements.uppercase);
  lowercaseReq.classList.toggle("valid", requirements.lowercase);
  numberReq.classList.toggle("valid", requirements.number);
  specialReq.classList.toggle("valid", requirements.special);
};

const checkPassword = () => {
  const password = passwordInput.value;

  if (!password) {
    showError(passwordError, "Password is required");
    validationState.password = false;
    updatePasswordRequirements({
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    });
  } else {
    const requirements = checkPasswordStrength(password);
    updatePasswordRequirements(requirements);

    const allRequirementsMet = Object.values(requirements).every((req) => req);

    if (!allRequirementsMet) {
      showError(passwordError, "Password does not meet all requirements");
      validationState.password = false;
    } else {
      clearError(passwordError);
      validationState.password = true;
    }
  }

  // Re-check confirm password when password changes
  if (confirmPasswordInput.value) {
    checkConfirmPassword();
  }

  updateSubmitButton();
};

// Confirm password validation
const checkConfirmPassword = () => {
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (!confirmPassword) {
    showError(confirmPasswordError, "Please confirm your password");
    validationState.confirmPassword = false;
  } else if (password !== confirmPassword) {
    showError(confirmPasswordError, "Passwords do not match");
    validationState.confirmPassword = false;
  } else {
    clearError(confirmPasswordError);
    validationState.confirmPassword = true;
  }

  updateSubmitButton();
};

// Terms validation
const checkTerms = () => {
  if (!termsCheckbox.checked) {
    showError(
      termsError,
      "You must agree to the Terms of Service and Privacy Policy",
    );
    validationState.terms = false;
  } else {
    clearError(termsError);
    validationState.terms = true;
  }

  updateSubmitButton();
};

// Password visibility toggle
const setupPasswordToggles = () => {
  passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      const input = toggle.parentElement.querySelector(
        'input[type="password"], input[type="text"]',
      );
      const icon = toggle.querySelector(".password-toggle-icon");

      if (input.type === "password") {
        input.type = "text";
        icon.textContent = "🙈";
        toggle.setAttribute("aria-label", "Hide password");
      } else {
        input.type = "password";
        icon.textContent = "👁️";
        toggle.setAttribute("aria-label", "Show password");
      }
    });
  });
};

// Form submission
const handleFormSubmit = async (e) => {
  e.preventDefault();

  // Final validation check
  checkEmail();
  checkUsername();
  checkPassword();
  checkConfirmPassword();
  checkTerms();

  const allValid = Object.values(validationState).every((valid) => valid);

  if (!allValid) {
    // Focus on first invalid field
    const firstInvalidField = form.querySelector(
      ".form-input.error, input:invalid",
    );
    if (firstInvalidField) {
      firstInvalidField.focus();
    }
    return;
  }

  // Show loading state
  submitBtn.disabled = true;
  btnText.style.display = "none";
  btnLoading.style.display = "flex";

  try {
    // Collect form data
    const formData = {
      email: emailInput.value.trim(),
      username: usernameInput.value.trim(),
      password: passwordInput.value,
      confirmPassword: confirmPasswordInput.value,
      terms: termsCheckbox.checked,
    };

    // Simulate API call (replace with actual endpoint)
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      // Success - show success message
      form.style.display = "none";
      successMessage.style.display = "block";

      // Optional: Redirect after success
      setTimeout(() => {
        // window.location.href = '/dashboard';
        console.log(
          "Signup successful! Redirect to dashboard would happen here.",
        );
      }, 2000);
    } else {
      // Handle server errors
      const errorData = await response.json();
      throw new Error(errorData.message || "Signup failed. Please try again.");
    }
  } catch (error) {
    console.error("Signup error:", error);

    // Show error message
    let errorMessage = "An error occurred during signup. Please try again.";

    if (error.message.includes("email")) {
      showError(emailError, "This email address is already registered");
    } else if (error.message.includes("username")) {
      showError(usernameError, "This username is already taken");
    } else {
      // Show general error
      showError(passwordError, errorMessage);
    }

    // Reset validation state for fields with errors
    validationState.email = !emailError.textContent;
    validationState.username = !usernameError.textContent;
    updateSubmitButton();
  } finally {
    // Reset button state
    btnText.style.display = "inline";
    btnLoading.style.display = "none";

    if (Object.values(validationState).every((valid) => valid)) {
      submitBtn.disabled = false;
    }
  }
};

// Real-time validation with debouncing
const setupRealTimeValidation = () => {
  const debouncedEmailCheck = debounce(checkEmail, 300);
  const debouncedUsernameCheck = debounce(checkUsername, 300);
  const debouncedPasswordCheck = debounce(checkPassword, 300);
  const debouncedConfirmPasswordCheck = debounce(checkConfirmPassword, 300);

  emailInput.addEventListener("input", debouncedEmailCheck);
  emailInput.addEventListener("blur", checkEmail);

  usernameInput.addEventListener("input", debouncedUsernameCheck);
  usernameInput.addEventListener("blur", checkUsername);

  passwordInput.addEventListener("input", debouncedPasswordCheck);
  passwordInput.addEventListener("blur", checkPassword);

  confirmPasswordInput.addEventListener("input", debouncedConfirmPasswordCheck);
  confirmPasswordInput.addEventListener("blur", checkConfirmPassword);

  termsCheckbox.addEventListener("change", checkTerms);
};

// Accessibility enhancements
const setupAccessibility = () => {
  // Add keyboard navigation for custom elements
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.classList.contains("checkbox-label")) {
      e.preventDefault();
      const checkbox = e.target.querySelector('input[type="checkbox"]');
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event("change"));
    }
  });

  // Announce validation errors to screen readers
  const announceError = (message) => {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;
    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  // Monitor for validation errors and announce them
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" || mutation.type === "characterData") {
        const target = mutation.target;
        if (
          target.classList &&
          target.classList.contains("error-message") &&
          target.textContent.trim()
        ) {
          announceError(`Validation error: ${target.textContent}`);
        }
      }
    });
  });

  // Observe error message elements
  [
    emailError,
    usernameError,
    passwordError,
    confirmPasswordError,
    termsError,
  ].forEach((element) => {
    observer.observe(element, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  });
};

// Initialize the form
const initializeForm = () => {
  setupPasswordToggles();
  setupRealTimeValidation();
  setupAccessibility();

  // Initial button state
  updateSubmitButton();

  // Form submission
  form.addEventListener("submit", handleFormSubmit);

  // Prevent form submission on Enter in input fields (except submit button)
  form.addEventListener("keydown", (e) => {
    if (
      e.key === "Enter" &&
      e.target.tagName === "INPUT" &&
      e.target.type !== "submit"
    ) {
      e.preventDefault();

      // Move to next input or submit if all valid
      const inputs = Array.from(
        form.querySelectorAll('input:not([type="submit"])'),
      );
      const currentIndex = inputs.indexOf(e.target);
      const nextInput = inputs[currentIndex + 1];

      if (nextInput) {
        nextInput.focus();
      } else if (Object.values(validationState).every((valid) => valid)) {
        submitBtn.click();
      }
    }
  });

  console.log("Signup form initialized successfully");
};

// Initialize when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeForm);
} else {
  initializeForm();
}
