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
  applyHitEffects(state);
}

function applyHitEffects(state) {
  const sprite = document.getElementById("player-sprite");
  const container = document.getElementById("player-section");

  if (!sprite || !container) return;

  // limpiar clases anteriores
  sprite.classList.remove("shake");
  container.classList.remove( "dodge-flash");

  if (state.hitEffect === "hit") {
    sprite.classList.add("shake");
    
  }

  
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
  const sprite = document.getElementById("player-sprite");
  const container = document.getElementById("player-arena");
  const cells = document.querySelectorAll(".arena-cell");

  if (!sprite || !container) return;

  // ---------------------------
  // MOVER SPRITE (centrado perfecto)
  // ---------------------------
  const targetCell = document.querySelector(
    `.arena-cell[data-pos="${state.playerPosition}"]`
  );

  if (targetCell) {
    const cellRect = targetCell.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const spriteWidth = sprite.offsetWidth || 120;

    const left =
      cellRect.left -
      containerRect.left +
      cellRect.width / 2 -
      spriteWidth / 2;

    sprite.style.left = left + "px";
  }

  // ---------------------------
  // DIRECCIÓN (FIX REAL)
  // Hydreigon mirando al enemigo
  // ---------------------------
  sprite.style.transform = "scaleX(-1)";
  sprite.style.transformOrigin = "center bottom";

  // ---------------------------
  // LIMPIAR ATAQUES
  // ---------------------------
  cells.forEach(cell => {
    cell.classList.remove("incoming");
  });

  // ---------------------------
  // ATAQUE ENEMIGO
  // ---------------------------
  if (state.incomingAttack) {
    const target = document.querySelector(
      `.arena-cell[data-pos="${state.incomingAttack}"]`
    );

    if (target) {
      target.classList.add("incoming");
    }
  }
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
// ---------------------------
// CONTROLES (MOVES 2x2 GRID)
// ---------------------------

function renderControls(state) {
  const attackContainer = document.getElementById("moves-container");

  if (!attackContainer) return;
  if (!state.player?.moves) return;

  const disabled = state.attackOnCooldown || state.phase !== "fighting";

  const moves = state.player.moves.slice(0, 4);

  attackContainer.innerHTML = `
    <div class="moves-grid">
      ${moves
        .map((move, i) => {
          const name = move?.name || "???";

          return `
            <button class="move-btn" data-move="${i}" ${disabled ? "disabled" : ""}>
              ${name}
            </button>
          `;
        })
        .join("")}
    </div>
  `;
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