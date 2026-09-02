(function initAccountPage() {
  const root = document.querySelector("[data-account-page]");
  if (!root) return;

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

  document.querySelector("[data-logout-confirm]")?.addEventListener("click", () => {
    closeLogout();
    window.location.href = "../home/";
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

  const profileForm = root.querySelector("[data-profile-form]");
  const profileFormState = profileForm ? initFormSubmitState(profileForm) : null;
  profileForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    showToast("Данные успешно сохранены");
    profileFormState?.resetBaseline();
  });

  const passwordForm = root.querySelector("[data-password-form]");
  const passwordFormState = passwordForm ? initFormSubmitState(passwordForm) : null;
  passwordForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const current = passwordForm.querySelector('[name="currentPassword"]');
    const next = passwordForm.querySelector('[name="newPassword"]');
    const repeat = passwordForm.querySelector('[name="repeatPassword"]');
    const repeatField = repeat?.closest("[data-field]");
    const repeatError = repeatField?.querySelector("[data-field-error]");

    repeatField?.classList.remove("is-invalid");
    if (repeatError) repeatError.hidden = true;

    if (next?.value && repeat?.value && next.value !== repeat.value) {
      repeatField?.classList.add("is-invalid");
      if (repeatError) {
        repeatError.textContent = "Пароли не совпадают";
        repeatError.hidden = false;
      }
      return;
    }

    if (!current?.value || !next?.value || !repeat?.value) {
      showToast("Не удалось изменить пароль. Попробуйте еще раз", "error");
      return;
    }

    showToast("Пароль успешно изменен");
    passwordForm.reset();
    passwordFormState?.resetBaseline();
  });

  root.querySelectorAll("[data-show-toast]").forEach((btn) => {
    btn.addEventListener("click", () => {
      showToast(btn.dataset.showToast, btn.dataset.toastType || "success");
    });
  });
})();
