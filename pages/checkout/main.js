(function initCheckoutPage() {
  const page = document.querySelector(".checkout-page");
  const form = document.querySelector("[data-checkout-form]");
  if (!page || !form) return;

  const phoneInput = form.querySelector("#checkout-phone");
  const addressField = form.querySelector("[data-address-field]");
  const addressInput = form.querySelector("#checkout-address");
  const successBlock = document.querySelector("[data-checkout-success]");

  if (new URLSearchParams(window.location.search).has("success")) {
    showSuccess();
  }

  form.querySelectorAll('input[name="delivery"]').forEach((input) => {
    input.addEventListener("change", () => {
      clearGroupError(form, "delivery");
      syncAddressVisibility();
    });
  });

  form.querySelectorAll('input[name="payment"]').forEach((input) => {
    input.addEventListener("change", () => clearGroupError(form, "payment"));
  });

  phoneInput?.addEventListener("input", () => {
    phoneInput.value = formatPhoneInput(phoneInput.value);
  });

  phoneInput?.addEventListener("blur", () => {
    phoneInput.value = formatPhoneInput(phoneInput.value, true);
  });

  form.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", () => clearFieldError(field));
    field.addEventListener("change", () => clearFieldError(field));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateForm(form)) return;
    showSuccess();
    window.history.replaceState({}, "", "?success=1");
  });

  syncAddressVisibility();

  function syncAddressVisibility() {
    const delivery = form.querySelector('input[name="delivery"]:checked')?.value;
    const needsAddress = delivery === "courier" || delivery === "shipping";
    if (!addressField) return;
    addressField.hidden = !needsAddress;
    if (!needsAddress && addressInput) {
      addressInput.value = "";
      clearFieldError(addressInput);
    }
  }

  function showSuccess() {
    page.classList.add("checkout-page--success");
    if (successBlock) successBlock.hidden = false;
    document.title = "Заказ оформлен — Мир ракеток";
    successBlock?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
})();

function validateForm(form) {
  let valid = true;
  let firstInvalid = null;

  clearGroupError(form, "delivery");
  clearGroupError(form, "payment");

  const name = form.querySelector("#checkout-name");
  const phone = form.querySelector("#checkout-phone");
  const email = form.querySelector("#checkout-email");
  const delivery = form.querySelector('input[name="delivery"]:checked');
  const payment = form.querySelector('input[name="payment"]:checked');
  const address = form.querySelector("#checkout-address");
  const privacy = form.querySelector('input[name="privacy"]');

  if (!validateName(name)) {
    valid = false;
    firstInvalid ||= name;
  }

  if (!validatePhone(phone)) {
    valid = false;
    firstInvalid ||= phone;
  }

  if (!validateEmail(email)) {
    valid = false;
    firstInvalid ||= email;
  }

  if (!delivery) {
    setGroupError(form, "delivery", "Выберите способ доставки");
    valid = false;
  }

  const needsAddress = delivery && (delivery.value === "courier" || delivery.value === "shipping");
  if (needsAddress && !validateAddress(address)) {
    valid = false;
    firstInvalid ||= address;
  }

  if (!payment) {
    setGroupError(form, "payment", "Выберите способ оплаты");
    valid = false;
  }

  if (!privacy?.checked) {
    setFieldError(privacy, "Подтвердите согласие с политикой обработки данных");
    valid = false;
    firstInvalid ||= privacy;
  }

  if (!valid && firstInvalid) {
    firstInvalid.focus({ preventScroll: true });
    firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return valid;
}

function validateName(input) {
  const value = input?.value.trim() || "";
  if (value.length < 5) {
    setFieldError(input, "Введите ФИО полностью");
    return false;
  }
  if (!/^[\p{L}\s\-'.]+$/u.test(value)) {
    setFieldError(input, "ФИО может содержать только буквы");
    return false;
  }
  clearFieldError(input);
  return true;
}

function validatePhone(input) {
  const digits = extractPhoneDigits(input?.value || "");
  if (digits.length !== 11 || !digits.startsWith("7")) {
    setFieldError(input, "Введите корректный номер телефона");
    return false;
  }
  clearFieldError(input);
  return true;
}

function validateEmail(input) {
  const value = input?.value.trim() || "";
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!pattern.test(value)) {
    setFieldError(input, "Введите корректный email");
    return false;
  }
  clearFieldError(input);
  return true;
}

function validateAddress(input) {
  const value = input?.value.trim() || "";
  if (value.length < 8) {
    setFieldError(input, "Укажите полный адрес доставки");
    return false;
  }
  clearFieldError(input);
  return true;
}

function setFieldError(field, message) {
  if (!field) return;
  const wrapper =
    field.closest("[data-field]") ||
    field.closest(".checkout-field") ||
    field.closest(".checkout-options")?.closest(".checkout-section__body");
  const errorEl = wrapper?.querySelector("[data-field-error]:not([data-for])");
  wrapper?.classList.add("is-invalid");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  }
}

function clearFieldError(field) {
  if (!field) return;
  const wrapper =
    field.closest("[data-field]") ||
    field.closest(".checkout-field") ||
    field.closest(".checkout-options");
  const errorEl = wrapper?.querySelector("[data-field-error]:not([data-for])");
  wrapper?.classList.remove("is-invalid");
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.hidden = true;
  }
}

function setGroupError(form, name, message) {
  const group = form.querySelector(`[data-field="${name}"]`) || form.querySelector(`[data-for="${name}"]`)?.closest(".checkout-section__body");
  const options = form.querySelector(`[data-field="${name}"]`);
  const errorEl = form.querySelector(`[data-field-error][data-for="${name}"]`);
  options?.classList.add("is-invalid");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  }
}

function clearGroupError(form, name) {
  const options = form.querySelector(`[data-field="${name}"]`);
  const errorEl = form.querySelector(`[data-field-error][data-for="${name}"]`);
  options?.classList.remove("is-invalid");
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.hidden = true;
  }
}

function extractPhoneDigits(value) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  if (digits.length === 10) digits = `7${digits}`;
  return digits.slice(0, 11);
}

function formatPhoneInput(value, finalize = false) {
  const digits = extractPhoneDigits(value);
  if (!digits) return "";

  const parts = [
    digits.slice(1, 4),
    digits.slice(4, 7),
    digits.slice(7, 9),
    digits.slice(9, 11),
  ];

  if (!parts[0]) return "+7";

  let result = `+7 (${parts[0]}`;
  if (parts[0].length < 3) return finalize ? result : result;

  result += `) ${parts[1]}`;
  if (parts[1].length < 3) return finalize ? result : result;

  if (parts[2]) result += `-${parts[2]}`;
  if (parts[3]) result += `-${parts[3]}`;
  return result;
}
