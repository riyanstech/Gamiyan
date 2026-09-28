/* =====================================================
   ACTIONS — aksi user (tap, buy upgrade)
   ===================================================== */
import { UPGRADES } from "../data.js";
import { state, recalcStats } from "../core/state.js";
import { getCost } from "./economy.js";
import { renderHeader, renderUpgrades } from "../ui/render.js";
import { showToast } from "../ui/toast.js";

let currentTab = "tap";
export function setCurrentTab(tab) { currentTab = tab; }
export function getCurrentTab() { return currentTab; }

/** Aksi tap pada batu */
export function doTap(x, y, tapAreaEl, rockEl) {
  const gain = state.tapPower;
  state.ore += gain;

  // Floating particle
  const p = document.createElement("div");
  p.className = "tap-particle";
  p.textContent = "+" + gain;
  const rect = tapAreaEl.getBoundingClientRect();
  p.style.left = (x - rect.left) + "px";
  p.style.top = (y - rect.top) + "px";
  tapAreaEl.appendChild(p);
  setTimeout(() => p.remove(), 1000);

  // Rock pulse animation
  rockEl.classList.remove("pulse");
  void rockEl.offsetWidth;
  rockEl.classList.add("pulse");

  renderHeader();
  renderUpgrades(currentTab);
}

/** Beli upgrade */
export function buyUpgrade(id) {
  const u = UPGRADES.find(x => x.id === id);
  if (!u) return;

  const cost = getCost(u);
  if (state.ore < cost) {
    showToast("🪨 Batu belum cukup!");
    return;
  }

  state.ore -= cost;
  state.upgrades[id] = (state.upgrades[id] || 0) + 1;
  recalcStats();
  renderHeader();
  renderUpgrades(currentTab);
  showToast(`${u.icon} ${u.name} Lv ${state.upgrades[id]}!`);
}