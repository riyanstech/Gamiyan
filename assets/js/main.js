/* =====================================================
   TAMBANG KAYA — Entry Point
   ===================================================== */
import { SAVE_INTERVAL_MS } from "./constants.js";
import { state, initUpgrades, recalcStats } from "./core/state.js";
import { loadLocal, saveLocal, getDeviceId } from "./core/storage.js";
import { saveCloud, loadCloud } from "./core/supabase.js";
import { doTap } from "./game/actions.js";
import { checkOffline } from "./game/offline.js";
import { renderHeader, renderUpgrades } from "./ui/render.js";
import { initTabs } from "./ui/tabs.js";

/* =====================================================
   INIT
   ===================================================== */
async function init() {
  // 1. Setup state awal
  initUpgrades();
  state.deviceId = getDeviceId();

  // 2. Coba load dari localStorage (instant, offline-first)
  const hasLocal = loadLocal();

  // 3. Kalau lokal kosong, coba load dari Supabase
  if (!hasLocal) {
    try {
      const cloud = await loadCloud();
      if (cloud) {
        state.ore = cloud.ore ?? 0;
        state.upgrades = cloud.upgrades ?? {};
        state.lastSave = new Date(cloud.updated_at).getTime();
        recalcStats();
      }
    } catch (e) {
      console.warn("Cloud load gagal, lanjut dengan state baru:", e);
    }
  }

  // 4. Render awal
  renderHeader();
  renderUpgrades("tap");
  initTabs();
  checkOffline();

  // 5. Pasang listener tap pada batu
  const rockEl = document.getElementById("mineRock");
  const tapArea = document.getElementById("tapArea");

  rockEl.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    const x = e.clientX ?? (e.touches?.[0]?.clientX ?? 0);
    const y = e.clientY ?? (e.touches?.[0]?.clientY ?? 0);
    doTap(x, y, tapArea, rockEl);
  });

  // 6. Game loop — 200ms tick
  let uiTick = 0;
  setInterval(() => {
    const now = Date.now();
    const dt = (now - state.lastTick) / 1000;
    state.lastTick = now;

    // Tambah income otomatis
    if (state.perSecond > 0) {
      state.ore += state.perSecond * dt;
    }

    // Render UI tiap ~1 detik (5 × 200ms)
    uiTick++;
    if (uiTick % 5 === 0) {
      renderHeader();
      const active = document.querySelector(".tab.active");
      if (active) renderUpgrades(active.dataset.tab);
    }
  }, 200);

  // 7. Auto-save tiap 5 detik
  setInterval(() => {
    saveLocal();
    saveCloud();
  }, SAVE_INTERVAL_MS);

  // 8. Save saat tab ditutup / disembunyikan
  window.addEventListener("beforeunload", () => {
    saveLocal();
    saveCloud();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      saveLocal();
      saveCloud();
    }
  });
}

init();