(function initAuthPage() {
  const root = document.querySelector("[data-auth-page]");
  if (!root) return;

  const REQUIRED_MESSAGE = "Это поле обязательно";
  const LOGIN_IDENTITY_EMPTY = "Введите телефон или e-mail";
  const LOGIN_IDENTITY_INVALID = "Введите корректный номер телефона или почту";
  const LOGIN_PASSWORD_EMPTY = "Введите пароль";
  const PHONE_INVALID_MESSAGE = "Введите корректный номер телефона";
  const EMAIL_INVALID_MESSAGE = "Введите корректный e-mail";
  const PASSWORD_MIN_MESSAGE = "Пароль должен содержать не менее 6 символов";
  const LOGIN_ERROR_MESSAGE = "Неверный телефон, e-mail или пароль";
  const SERVER_ERROR_MESSAGE = "Не удалось выполнить запрос. Попробуйте ещё раз";

  function isEmailIdentity(value) {
    return value.includes("@");
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validatePhoneIdentity(value) {
    const compact = value.replace(/\s/g, "");
    if (!/^(\+7|7|8)/.test(compact)) {
      return { valid: false };
    }

    const digits = value.replace(/\D/g, "");
    let normalizedDigits;

    if (compact.startsWith("+7")) {
      if (digits.length !== 11 || !digits.startsWith("7")) {
        return { valid: false };
      }
      normalizedDigits = digits;
    } else if (digits.startsWith("8")) {
      if (digits.length !== 11) {
        return { valid: false };
      }
      normalizedDigits = `7${digits.slice(1)}`;
    } else if (digits.startsWith("7")) {
      if (digits.length !== 11) {
        return { valid: false };
      }
      normalizedDigits = digits;
    } else {
      return { valid: false };
    }

    return { valid: true, normalized: `+${normalizedDigits}` };
  }

  function validateLoginIdentity(value) {
    if (isEmailIdentity(value)) {
      if (!isEmail(value)) {
        return { valid: false, message: LOGIN_IDENTITY_INVALID };
      }
      return { valid: true, normalized: value.trim() };
    }

    const phoneResult = validatePhoneIdentity(value);
    if (!phoneResult.valid) {
      return { valid: false, message: LOGIN_IDENTITY_INVALID };
    }

    return { valid: true, normalized: phoneResult.normalized };
  }

  function isPhone(value) {
    return validatePhoneIdentity(value).valid;
  }

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
    const identity = identityInput?.value.trim() || "";
    const password = loginForm.querySelector('[name="password"]')?.value || "";

    let hasError = false;

    if (!identity) {
      hasError = setFieldError(identityField, LOGIN_IDENTITY_EMPTY) || hasError;
    }

    if (!password) {
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
  const registerSubmit = registerForm?.querySelector('[type="submit"]');

  function updateRegisterSubmitState() {
    if (!registerForm || !registerSubmit) return;

    const phone = registerForm.querySelector('[name="phone"]')?.value.trim() || "";
    const email = registerForm.querySelector('[name="email"]')?.value.trim() || "";
    const password = registerForm.querySelector('[name="password"]')?.value || "";
    const agreement = registerForm.querySelector('[name="agreement"]')?.checked;

    registerSubmit.disabled = !(phone && email && password && agreement);
  }

  registerForm?.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      clearFieldError(input.closest("[data-field]"));
      registerForm.querySelector("[data-auth-alert]")?.setAttribute("hidden", "");
      updateRegisterSubmitState();
    });
    input.addEventListener("change", updateRegisterSubmitState);
  });

  updateRegisterSubmitState();

  registerForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    clearFormErrors(registerForm);

    const phoneField = registerForm.querySelector('[data-field="phone"]');
    const emailField = registerForm.querySelector('[data-field="email"]');
    const passwordField = registerForm.querySelector('[data-field="password"]');
    const agreementField = registerForm.querySelector('[data-field="agreement"]');

    const phone = registerForm.querySelector('[name="phone"]')?.value.trim() || "";
    const email = registerForm.querySelector('[name="email"]')?.value.trim() || "";
    const password = registerForm.querySelector('[name="password"]')?.value || "";
    const agreement = registerForm.querySelector('[name="agreement"]')?.checked;

    let hasError = false;

    if (!phone) {
      hasError = setFieldError(phoneField, REQUIRED_MESSAGE) || hasError;
    } else if (!isPhone(phone)) {
      hasError = setFieldError(phoneField, PHONE_INVALID_MESSAGE) || hasError;
    }

    if (!email) {
      hasError = setFieldError(emailField, REQUIRED_MESSAGE) || hasError;
    } else if (!isEmail(email)) {
      hasError = setFieldError(emailField, EMAIL_INVALID_MESSAGE) || hasError;
    }

    if (!password) {
      hasError = setFieldError(passwordField, REQUIRED_MESSAGE) || hasError;
    } else if (password.length < 6) {
      hasError = setFieldError(passwordField, PASSWORD_MIN_MESSAGE) || hasError;
    }

    if (!agreement) {
      hasError = setFieldError(agreementField, REQUIRED_MESSAGE) || hasError;
    }

    if (hasError) {
      updateRegisterSubmitState();
      return;
    }

    if (email === "error@demo.ru") {
      setFormAlert(registerForm, SERVER_ERROR_MESSAGE);
      return;
    }

    window.location.href = "./index.html";
  });
})();
