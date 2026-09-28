import { renderUpgrades } from "./render.js";
import { setCurrentTab } from "../game/actions.js";

export function initTabs() {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const tabName = tab.dataset.tab;
      setCurrentTab(tabName);
      renderUpgrades(tabName);
    });
  });
}