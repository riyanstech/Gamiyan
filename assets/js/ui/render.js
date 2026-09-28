import { UPGRADES } from "../data.js";
import { state } from "../core/state.js";
import { formatNumber, getCost } from "../game/economy.js";
import { buyUpgrade } from "../game/actions.js";

const oreCountEl = document.getElementById("oreCount");
const perSecondEl = document.getElementById("perSecond");
const upgradesListEl = document.getElementById("upgradesList");

export function renderHeader() {
  oreCountEl.textContent = formatNumber(state.ore);
  perSecondEl.textContent = formatNumber(state.perSecond);
}

export function renderUpgrades(tab = "tap") {
  upgradesListEl.innerHTML = "";
  const list = UPGRADES.filter(u => u.type === tab);

  list.forEach(u => {
    const level = state.upgrades[u.id] || 0;
    const cost = getCost(u);
    const affordable = state.ore >= cost;

    const card = document.createElement("div");
    card.className = "upgrade" + (affordable ? "" : " disabled");
    card.dataset.id = u.id;

    card.innerHTML = `
      <div class="upgrade-icon">${u.icon}</div>
      <div class="upgrade-info">
        <div class="upgrade-name">${u.name}</div>
        <div class="upgrade-effect">${u.desc}</div>
      </div>
      <div class="upgrade-right">
        <div class="upgrade-level">Lv ${level}</div>
        <div class="upgrade-cost ${affordable ? 'affordable' : ''}">
          🪨 ${formatNumber(cost)}
        </div>
      </div>
    `;

    card.addEventListener("click", () => buyUpgrade(u.id));
    upgradesListEl.appendChild(card);
  });
}