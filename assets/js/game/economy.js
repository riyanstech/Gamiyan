/* =====================================================
   ECONOMY — format angka & kalkulasi biaya
   ===================================================== */
import { COST_MULTIPLIER } from "../constants.js";
import { state } from "../core/state.js";

/** Format angka jadi ringkas: 1500 → 1,5K, 2_500_000 → 2,5M */
export function formatNumber(n) {
  if (n < 1000) return Math.floor(n).toLocaleString("id-ID");
  const units = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp"];
  let tier = Math.floor(Math.log10(n) / 3);
  if (tier >= units.length) tier = units.length - 1;
  const scaled = n / Math.pow(1000, tier);
  const decimals = scaled < 10 ? 2 : scaled < 100 ? 1 : 0;
  return scaled.toFixed(decimals).replace(".", ",") + units[tier];
}

/** Hitung biaya upgrade berdasarkan level saat ini */
export function getCost(upgrade) {
  const level = state.upgrades[upgrade.id] || 0;
  return Math.ceil(upgrade.baseCost * Math.pow(COST_MULTIPLIER, level));
}

/** Cek apakah user mampu beli */
export function canAfford(upgrade) {
  return state.ore >= getCost(upgrade);
}