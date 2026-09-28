/* =====================================================
   STORAGE — localStorage save/load
   ===================================================== */
import { SAVE_KEY, DEVICE_KEY } from "../constants.js";
import { serializeState, hydrateState } from "./state.js";

/** Ambil atau buat device ID (untuk guest user) */
export function getDeviceId() {
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = "dev_" + (crypto.randomUUID ? crypto.randomUUID() : Date.now() + "_" + Math.random().toString(36).slice(2));
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

/** Simpan state ke localStorage */
export function saveLocal() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(serializeState()));
  } catch (e) {
    console.warn("Save lokal gagal:", e);
  }
}

/** Load state dari localStorage. Return true kalau ada save. */
export function loadLocal() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    hydrateState(JSON.parse(raw));
    return true;
  } catch (e) {
    console.warn("Load lokal gagal:", e);
    return false;
  }
}

/** Hapus save lokal (untuk debugging) */
export function clearLocal() {
  localStorage.removeItem(SAVE_KEY);
}