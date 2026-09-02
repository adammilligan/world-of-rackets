(function initAuthPage() {
  const root = document.querySelector("[data-auth-page]");
  if (!root) return;

  const {
    validateLoginIdentity,
    validateRuPhone,
    validateRuEmail,
    validatePassword,
    trimValue,
  } = window.FormValidation;

  const LOGIN_IDENTITY_EMPTY = "Введите телефон или e-mail";
  const LOGIN_PASSWORD_EMPTY = "Введите пароль";
  const LOGIN_ERROR_MESSAGE = "Неверный телефон, e-mail или пароль";
  const SERVER_ERROR_MESSAGE = "Не удалось выполнить запрос. Попробуйте ещё раз";

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
    const alert = form.querySelector("[data-auth-alert]");
    if (alert) alert.hidden = true;
  }

  function setFormAlert(form, message) {
    const alert = form.querySelector("[data-auth-alert]");
    if (!alert) return;
    alert.textContent = message;
    alert.hidden = false;
  }

  const loginForm = root.querySelector("[data-login-form]");
  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    clearFormErrors(loginForm);

    const identityField = loginForm.querySelector('[data-field="identity"]');
    const passwordField = loginForm.querySelector('[data-field="password"]');
    const identityInput = loginForm.querySelector('[name="identity"]');
    const passwordInput = loginForm.querySelector('[name="password"]');
    const identity = identityInput?.value || "";
    const password = passwordInput?.value || "";

    let hasError = false;

    if (trimValue(identity) === "") {
      hasError = setFieldError(identityField, LOGIN_IDENTITY_EMPTY) || hasError;
    }

    if (trimValue(password) === "") {
      hasError = setFieldError(passwordField, LOGIN_PASSWORD_EMPTY) || hasError;
    }

    if (hasError) return;

    const identityResult = validateLoginIdentity(identity);
    if (!identityResult.valid) {
      setFieldError(identityField, identityResult.message);
      return;
    }

    if (identityInput) {
      identityInput.value = identityResult.normalized;
    }

    const normalizedIdentity = identityResult.normalized;

    if (normalizedIdentity === "error@demo.ru") {
      setFormAlert(loginForm, SERVER_ERROR_MESSAGE);
      return;
    }

    if (normalizedIdentity === "wrong@demo.ru") {
      setFieldError(identityField, LOGIN_ERROR_MESSAGE);
      setFieldError(passwordField, LOGIN_ERROR_MESSAGE);
      return;
    }

    window.location.href = "./index.html";
  });

  loginForm?.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      clearFieldError(input.closest("[data-field]"));
      loginForm.querySelector("[data-auth-alert]")?.setAttribute("hidden", "");
    });
  });

  const registerForm = root.querySelector("[data-register-form]");
  const AGREEMENT_REQUIRED_MESSAGE = "Необходимо принять условия";

  registerForm?.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      clearFieldError(input.closest("[data-field]"));
      registerForm.querySelector("[data-auth-alert]")?.setAttribute("hidden", "");
    });
    input.addEventListener("change", () => {
      clearFieldError(input.closest("[data-field]"));
    });
  });

  registerForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    clearFormErrors(registerForm);

    const phoneField = registerForm.querySelector('[data-field="phone"]');
    const emailField = registerForm.querySelector('[data-field="email"]');
    const passwordField = registerForm.querySelector('[data-field="password"]');
    const agreementField = registerForm.querySelector('[data-field="agreement"]');

    const phoneInput = registerForm.querySelector('[name="phone"]');
    const emailInput = registerForm.querySelector('[name="email"]');
    const passwordInput = registerForm.querySelector('[name="password"]');
    const agreement = registerForm.querySelector('[name="agreement"]')?.checked;

    let hasError = false;

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

    const passwordResult = validatePassword(passwordInput?.value, { required: true });
    if (!passwordResult.valid) {
      hasError = setFieldError(passwordField, passwordResult.message) || hasError;
    }

    if (!agreement) {
      hasError = setFieldError(agreementField, AGREEMENT_REQUIRED_MESSAGE) || hasError;
    }

    if (hasError) {
      return;
    }

    if (trimValue(emailInput?.value) === "error@demo.ru") {
      setFormAlert(registerForm, SERVER_ERROR_MESSAGE);
      return;
    }

    window.location.href = "./index.html";
  });
})();
