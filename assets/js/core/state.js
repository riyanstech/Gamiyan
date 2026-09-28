/* =====================================================
   STATE — Single Source of Truth
   ===================================================== */
import { UPGRADES } from "../data.js";

export const state = {
  ore: 0,
  tapPower: 1,
  perSecond: 0,
  upgrades: {},
  lastSave: Date.now(),
  lastTick: Date.now(),
  deviceId: null,
  userId: null,
};

/** Inisialisasi semua level upgrade ke 0 */
export function initUpgrades() {
  UPGRADES.forEach(u => { state.upgrades[u.id] = 0; });
}

/** Recalculate tapPower & perSecond dari level upgrade */
export function recalcStats() {
  let tap = 1;
  let auto = 0;
  UPGRADES.forEach(u => {
    const level = state.upgrades[u.id] || 0;
    if (u.type === "tap") tap += u.effect * level;
    if (u.type === "auto") auto += u.effect * level;
  });
  state.tapPower = tap;
  state.perSecond = auto;
}

/** Snapshot state untuk disimpan */
export function serializeState() {
  return {
    ore: state.ore,
    tapPower: state.tapPower,
    perSecond: state.perSecond,
    upgrades: state.upgrades,
    lastSave: Date.now(),
  };
}

/** Restore state dari object tersimpan */
export function hydrateState(data) {
  if (!data) return;
  state.ore = data.ore ?? 0;
  state.upgrades = data.upgrades ?? {};
  state.lastSave = data.lastSave ?? Date.now();
  state.lastTick = Date.now();
  recalcStats();
}