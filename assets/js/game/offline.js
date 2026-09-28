/* =====================================================
   OFFLINE EARNINGS — hitung & tampilkan modal
   ===================================================== */
import { OFFLINE_RATE, OFFLINE_MIN_SECONDS } from "../constants.js";
import { state } from "../core/state.js";
import { formatNumber } from "./economy.js";
import { renderHeader } from "../ui/render.js";
import { showToast } from "../ui/toast.js";

export function checkOffline() {
  const elapsed = (Date.now() - state.lastSave) / 1000;
  if (elapsed < OFFLINE_MIN_SECONDS) return;
  if (state.perSecond <= 0) return;

  const earned = Math.floor(state.perSecond * elapsed * OFFLINE_RATE);
  if (earned <= 0) return;

  const modal = document.getElementById("offlineModal");
  const rewardEl = document.getElementById("offlineReward");
  rewardEl.textContent = "+" + formatNumber(earned) + " 🪨";
  modal.classList.add("show");

  document.getElementById("offlineClaim").onclick = () => {
    state.ore += earned;
    modal.classList.remove("show");
    renderHeader();
    showToast("💰 Hasil tambang diklaim!");
  };
}