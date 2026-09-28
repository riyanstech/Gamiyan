const toastEl = document.getElementById("toast");
let timeout;

export function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(timeout);
  timeout = setTimeout(() => toastEl.classList.remove("show"), 1500);
}