const REMEMBER_EMAIL_KEY = "household-ledger-remembered-email";

const loginEmailInput = document.querySelector("#loginEmail");
const rememberEmailInput = document.querySelector("#rememberEmail");
const togglePasswordBtn = document.querySelector("#togglePassword");
const loginPasswordInput = document.querySelector("#loginPassword");
const loginFormEl = document.querySelector("#loginForm");

const savedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY);
if (savedEmail && loginEmailInput && rememberEmailInput) {
  loginEmailInput.value = savedEmail;
  rememberEmailInput.checked = true;
}

if (togglePasswordBtn && loginPasswordInput) {
  togglePasswordBtn.addEventListener("click", () => {
    const showing = loginPasswordInput.type === "text";
    loginPasswordInput.type = showing ? "password" : "text";
    togglePasswordBtn.textContent = showing ? "보기" : "숨기기";
    togglePasswordBtn.setAttribute("aria-label", showing ? "비밀번호 보기" : "비밀번호 숨기기");
  });
}

if (loginFormEl && loginEmailInput && rememberEmailInput) {
  loginFormEl.addEventListener("submit", () => {
    if (rememberEmailInput.checked) {
      localStorage.setItem(REMEMBER_EMAIL_KEY, loginEmailInput.value.trim());
    } else {
      localStorage.removeItem(REMEMBER_EMAIL_KEY);
    }
  });
}
