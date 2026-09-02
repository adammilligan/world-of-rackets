(function initAccountPage() {
  const root = document.querySelector("[data-account-page]");
  if (!root) return;

  const profileForm = root.querySelector("[data-profile-form]");
  const passwordForm = root.querySelector("[data-password-form]");

  const toast = document.querySelector("[data-account-toast]");
  const logoutModal = document.querySelector("[data-logout-modal]");
  const logoutSheet = document.querySelector("[data-logout-sheet]");
  const mobileMq = window.matchMedia("(max-width: 860px)");

  let toastTimer;

  function showToast(message, type = "success") {
    if (!toast) return;
    clearTimeout(toastTimer);

    const icon = toast.querySelector("[data-account-toast-icon]");
    toast.hidden = false;
    toast.classList.toggle("account-toast--error", type === "error");
    toast.querySelector("[data-account-toast-text]").textContent = message;

    if (icon) {
      icon.src =
        type === "error"
          ? "../../shared/images/icons/info.svg"
          : "../../shared/images/icons/check-circle.svg";
    }

    toastTimer = window.setTimeout(() => {
      toast.hidden = true;
    }, 4000);
  }

  function openLogout() {
    if (mobileMq.matches && logoutSheet) {
      logoutSheet.hidden = false;
      logoutSheet.classList.add("is-open");
      document.body.style.overflow = "hidden";
      return;
    }

    if (logoutModal) {
      logoutModal.hidden = false;
      document.body.style.overflow = "hidden";
    }
  }

  function closeLogout() {
    if (logoutModal) logoutModal.hidden = true;
    if (logoutSheet) {
      logoutSheet.hidden = true;
      logoutSheet.classList.remove("is-open");
    }
    document.body.style.overflow = "";
  }

  root.querySelectorAll("[data-logout-open]").forEach((btn) => {
    btn.addEventListener("click", openLogout);
  });

  document.querySelectorAll("[data-logout-close]").forEach((btn) => {
    btn.addEventListener("click", closeLogout);
  });

  document.querySelectorAll("[data-logout-confirm]").forEach((btn) => {
    btn.addEventListener("click", () => {
      closeLogout();
      window.location.href = "../home/";
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!logoutModal?.hidden || logoutSheet?.classList.contains("is-open")) {
      closeLogout();
    }
  });

  root.querySelectorAll("[data-password-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = root.querySelector(`#${btn.getAttribute("aria-controls")}`);
      if (!input) return;

      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      btn.setAttribute("aria-pressed", String(isHidden));
      btn.setAttribute("aria-label", isHidden ? "Скрыть пароль" : "Показать пароль");

      const icon = btn.querySelector("img");
      if (icon) {
        icon.src = isHidden
          ? "../../shared/images/icons/eye.png"
          : "../../shared/images/icons/eye-slash.png";
      }
    });
  });

  function clearFieldError(field) {
    field?.classList.remove("is-invalid");
    const error = field?.querySelector("[data-field-error]");
    if (error) error.hidden = true;
  }

  function setFieldError(field, message) {
    if (!field) return false;
    field.classList.add("is-invalid");
    const error = field.querySelector("[data-field-error]");
    if (error) {
      error.textContent = message;
      error.hidden = false;
    }
    return true;
  }

  function clearFormErrors(form) {
    form.querySelectorAll("[data-field]").forEach(clearFieldError);
  }

  function bindFieldValidationClear(form) {
    form.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", () => clearFieldError(input.closest("[data-field]")));
    });
  }

  function getFormSnapshot(form) {
    return [...form.querySelectorAll("input")].map((input) => input.value);
  }

  function initFormSubmitState(form) {
    let initialSnapshot = getFormSnapshot(form);

    function update() {
      const submit = form.querySelector('[type="submit"]');
      if (!submit) return;

      const current = getFormSnapshot(form);
      submit.disabled = !current.some((value, index) => value !== initialSnapshot[index]);
    }

    form.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", update);
    });

    update();

    return {
      resetBaseline() {
        initialSnapshot = getFormSnapshot(form);
        update();
      },
    };
  }

  function validateProfileForm(form) {
    const { validateText, validateRuEmail, validateRuPhone, validateOptionalText } = window.FormValidation;
    clearFormErrors(form);

    const nameField = form.querySelector('[data-field="name"]');
    const phoneField = form.querySelector('[data-field="phone"]');
    const emailField = form.querySelector('[data-field="email"]');
    const addressField = form.querySelector('[data-field="address"]');

    const nameInput = form.querySelector('[name="name"]');
    const phoneInput = form.querySelector('[name="phone"]');
    const emailInput = form.querySelector('[name="email"]');
    const addressInput = form.querySelector('[name="address"]');

    let hasError = false;

    const nameResult = validateText(nameInput?.value, { required: true });
    if (!nameResult.valid) {
      hasError = setFieldError(nameField, nameResult.message) || hasError;
    }

    const phoneResult = validateRuPhone(phoneInput?.value, { required: true });
    if (!phoneResult.valid) {
      hasError = setFieldError(phoneField, phoneResult.message) || hasError;
    } else if (phoneInput && phoneResult.normalized) {
      phoneInput.value = phoneResult.normalized;
    }

    const emailResult = validateRuEmail(emailInput?.value, { required: true });
    if (!emailResult.valid) {
      hasError = setFieldError(emailField, emailResult.message) || hasError;
    } else if (emailInput && emailResult.value) {
      emailInput.value = emailResult.value;
    }

    const addressResult = validateOptionalText(addressInput?.value);
    if (!addressResult.valid) {
      hasError = setFieldError(addressField, addressResult.message) || hasError;
    } else if (addressInput) {
      addressInput.value = addressResult.value;
    }

    if (nameResult.valid && nameInput) {
      nameInput.value = nameResult.value;
    }

    return !hasError;
  }

  function validatePasswordForm(form) {
    const { validatePassword, trimValue, MESSAGES } = window.FormValidation;
    clearFormErrors(form);

    const currentField = form.querySelector('[data-field="currentPassword"]');
    const newField = form.querySelector('[data-field="newPassword"]');
    const repeatField = form.querySelector('[data-field="repeatPassword"]');

    const currentInput = form.querySelector('[name="currentPassword"]');
    const newInput = form.querySelector('[name="newPassword"]');
    const repeatInput = form.querySelector('[name="repeatPassword"]');

    let hasError = false;

    if (trimValue(currentInput?.value) === "") {
      hasError = setFieldError(currentField, MESSAGES.required) || hasError;
    }

    const newResult = validatePassword(newInput?.value, { required: true });
    if (!newResult.valid) {
      hasError = setFieldError(newField, newResult.message) || hasError;
    }

    const repeatResult = validatePassword(repeatInput?.value, { required: true });
    if (!repeatResult.valid) {
      hasError = setFieldError(repeatField, repeatResult.message) || hasError;
    }

    if (!hasError && trimValue(newInput?.value) !== trimValue(repeatInput?.value)) {
      hasError = setFieldError(repeatField, "Пароли не совпадают") || hasError;
    }

    return !hasError;
  }

  const profileFormState = profileForm ? initFormSubmitState(profileForm) : null;
  if (profileForm && window.FormValidation) {
    bindFieldValidationClear(profileForm);
    profileForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validateProfileForm(profileForm)) return;
      showToast("Данные успешно сохранены");
      profileFormState?.resetBaseline();
    });
  }

  const passwordFormState = passwordForm ? initFormSubmitState(passwordForm) : null;
  if (passwordForm && window.FormValidation) {
    bindFieldValidationClear(passwordForm);
    passwordForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validatePasswordForm(passwordForm)) return;
      showToast("Пароль успешно изменен");
      passwordForm.reset();
      passwordFormState?.resetBaseline();
    });
  }

  root.querySelectorAll("[data-show-toast]").forEach((btn) => {
    btn.addEventListener("click", () => {
      showToast(btn.dataset.showToast, btn.dataset.toastType || "success");
    });
  });
})();
