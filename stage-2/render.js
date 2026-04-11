import TRAINER from "../trainer.config.js";



// ---------------------------
// MAIN RENDER
// ---------------------------
export function render(state) {
  renderInfo(state);
  renderHP(state);
  renderArena(state);
  renderLog(state);
  renderControls(state);
  renderEnd(state);
}

// ---------------------------
// PLAYER / OPPONENT INFO
// ---------------------------
function renderInfo(state) {
  const playerName = document.getElementById("player-name");
  const opponentName = document.getElementById("opponent-name");

  const playerSprite = document.getElementById("player-sprite");
  const opponentSprite = document.getElementById("opponent-sprite");

  if (playerName) playerName.textContent = state.player.name.toUpperCase();
  if (opponentName) opponentName.textContent = state.opponent.name.toUpperCase();

  if (playerSprite) playerSprite.src = state.player.sprites.front_default;
  if (opponentSprite) opponentSprite.src = state.opponent.sprites.front_default;
}

// ---------------------------
// HP BARS
// ---------------------------
function renderHP(state) {
  const playerBar = document.getElementById("player-hp");
  const opponentBar = document.getElementById("opponent-hp");

  const playerMax = Math.floor(getStat(state.player, "hp") * 2.5);
  const opponentMax = Math.floor(getStat(state.opponent, "hp") * 2.5);

  const playerPct = Math.max((state.playerHP / playerMax) * 100, 0);
  const opponentPct = Math.max((state.opponentHP / opponentMax) * 100, 0);

  if (playerBar) playerBar.style.width = playerPct + "%";
  if (opponentBar) opponentBar.style.width = opponentPct + "%";
}

// ---------------------------
// ARENA (CLAVE)
// ---------------------------
function renderArena(state) {
  const playerCells = document.querySelectorAll("#player-row .cell");
  const opponentCells = document.querySelectorAll("#opponent-row .cell");

  playerCells.forEach(cell => {
    const pos = Number(cell.dataset.pos);

    cell.classList.remove("active", "incoming", "hit");

    // jugador
    if (pos === state.playerPosition) {
      cell.classList.add("active");
    }

    // ataque entrante
    if (pos === state.incomingAttack) {
      cell.classList.add("incoming");
    }
  });

  opponentCells.forEach(cell => {
    const pos = Number(cell.dataset.pos);

    cell.classList.remove("incoming");

    if (pos === state.incomingAttack) {
      cell.classList.add("incoming");
    }
  });
}

// ---------------------------
// LOG
// ---------------------------
function renderLog(state) {
  const logEl = document.getElementById("log");
  if (!logEl) return;

  logEl.innerHTML = state.log
    .map(entry => `<p>${entry}</p>`)
    .join("");

  // auto scroll
  logEl.scrollTop = logEl.scrollHeight;
}

// ---------------------------
// CONTROLS
// ---------------------------
function renderControls(state) {
  const attackBtn = document.getElementById("attack-btn");
  const ultimateBtn = document.getElementById("ultimate-btn");

  if (attackBtn) {
    attackBtn.disabled = state.attackOnCooldown || state.phase !== "fighting";
  }

  if (ultimateBtn) {
    ultimateBtn.disabled = state.definitiveUsed || state.phase !== "fighting";
  }
}

// ---------------------------
// END STATE
// ---------------------------
function renderEnd(state) {
  const resetBtn = document.getElementById("reset-btn");

  if (state.phase === "ended") {
    if (resetBtn) resetBtn.style.display = "block";
  } else {
    if (resetBtn) resetBtn.style.display = "none";
  }
}

// ---------------------------
// HELPER
// ---------------------------
function getStat(pokemon, statName) {
  const stat = pokemon.stats.find(s => s.stat.name === statName);
  return stat ? stat.base_stat : 0;
}