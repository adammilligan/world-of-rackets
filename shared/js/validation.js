(function initFormValidation(global) {
  const SCRIPT_PATTERN = /<script[\s>]|javascript:|on[a-z]+\s*=|<\/script|<iframe[\s>]/i;
  const RU_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.(ru|рф|xn--p1ai)$/iu;
  const PASSWORD_MIN_LENGTH = 8;

  const MESSAGES = {
    required: "Это поле обязательно",
    script: "Поле содержит недопустимые символы",
    email: "Введите корректный e-mail с доменом .ru или .рф",
    emailInvalid: "Введите корректный e-mail с доменом .ru или .рф",
    phoneInvalid: "Введите корректный номер телефона",
    passwordMin: `Пароль должен содержать не менее ${PASSWORD_MIN_LENGTH} символов`,
  };

  function trimValue(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function isBlank(value) {
    return trimValue(value) === "";
  }

  function containsScript(value) {
    return SCRIPT_PATTERN.test(String(value));
  }

  function validateText(value, { required = true } = {}) {
    const trimmed = trimValue(value);
    if (required && trimmed === "") {
      return { valid: false, message: MESSAGES.required, value: trimmed };
    }
    if (trimmed !== "" && containsScript(value)) {
      return { valid: false, message: MESSAGES.script, value: trimmed };
    }
    return { valid: true, value: trimmed };
  }

  function validateOptionalText(value) {
    const trimmed = trimValue(value);
    if (trimmed === "") {
      return { valid: true, value: trimmed };
    }
    if (containsScript(value)) {
      return { valid: false, message: MESSAGES.script, value: trimmed };
    }
    return { valid: true, value: trimmed };
  }

  function isRuEmail(value) {
    return RU_EMAIL_PATTERN.test(trimValue(value));
  }

  function validateRuEmail(value, { required = true } = {}) {
    const trimmed = trimValue(value);
    if (required && trimmed === "") {
      return { valid: false, message: MESSAGES.required, value: trimmed };
    }
    if (trimmed === "") {
      return { valid: true, value: trimmed };
    }
    if (containsScript(value)) {
      return { valid: false, message: MESSAGES.script, value: trimmed };
    }
    if (!isRuEmail(trimmed)) {
      return { valid: false, message: MESSAGES.email, value: trimmed };
    }
    return { valid: true, value: trimmed };
  }

  function validatePassword(value, { required = true, minLength = PASSWORD_MIN_LENGTH } = {}) {
    const trimmed = trimValue(value);
    if (required && trimmed === "") {
      return { valid: false, message: MESSAGES.required };
    }
    if (trimmed === "") {
      return { valid: true, value: trimmed };
    }
    if (trimmed.length < minLength) {
      return { valid: false, message: MESSAGES.passwordMin };
    }
    return { valid: true, value: trimmed };
  }

  function validateRuPhone(value, { required = true } = {}) {
    const trimmed = trimValue(value);
    if (required && trimmed === "") {
      return { valid: false, message: MESSAGES.required };
    }
    if (trimmed === "") {
      return { valid: true, normalized: "" };
    }
    if (containsScript(value)) {
      return { valid: false, message: MESSAGES.script };
    }

    const compact = trimmed.replace(/\s/g, "");
    if (!/^(\+7|7|8)/.test(compact)) {
      return { valid: false, message: MESSAGES.phoneInvalid };
    }

    const digits = trimmed.replace(/\D/g, "");
    let normalizedDigits;

    if (compact.startsWith("+7")) {
      if (digits.length !== 11 || !digits.startsWith("7")) {
        return { valid: false, message: MESSAGES.phoneInvalid };
      }
      normalizedDigits = digits;
    } else if (digits.startsWith("8")) {
      if (digits.length !== 11) {
        return { valid: false, message: MESSAGES.phoneInvalid };
      }
      normalizedDigits = `7${digits.slice(1)}`;
    } else if (digits.startsWith("7")) {
      if (digits.length !== 11) {
        return { valid: false, message: MESSAGES.phoneInvalid };
      }
      normalizedDigits = digits;
    } else {
      return { valid: false, message: MESSAGES.phoneInvalid };
    }

    return { valid: true, normalized: `+${normalizedDigits}`, value: trimmed };
  }

  function validateLoginIdentity(value) {
    const trimmed = trimValue(value);
    if (trimmed === "") {
      return { valid: false, message: MESSAGES.required };
    }
    if (containsScript(value)) {
      return { valid: false, message: MESSAGES.script };
    }

    if (trimmed.includes("@")) {
      if (!isRuEmail(trimmed)) {
        return { valid: false, message: MESSAGES.emailInvalid };
      }
      return { valid: true, normalized: trimmed };
    }

    const phoneResult = validateRuPhone(trimmed, { required: true });
    if (!phoneResult.valid) {
      return { valid: false, message: MESSAGES.phoneInvalid };
    }
    return { valid: true, normalized: phoneResult.normalized };
  }

  global.FormValidation = {
    trimValue,
    isBlank,
    containsScript,
    validateText,
    validateOptionalText,
    isRuEmail,
    validateRuEmail,
    validatePassword,
    validateRuPhone,
    validateLoginIdentity,
    PASSWORD_MIN_LENGTH,
    MESSAGES,
  };
})(window);
