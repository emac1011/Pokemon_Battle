import { state, initBattle, startEnemyLoop, playerAttack, useDefinitive } from "./battle.js";
import { render } from "./render.js";

// ---------------------------
// KEYBOARD HANDLER
// ---------------------------
function onKeyDown(e) {
  if (state.phase !== "fighting") return;
  if (state.locked) return;

  if (e.key === "ArrowLeft" && state.playerPosition > 1) {
    state.playerPosition--;
  }

  if (e.key === "ArrowRight" && state.playerPosition < 3) {
    state.playerPosition++;
  }

  render(state);
}

// ---------------------------
// INIT
// ---------------------------
function init() {
  initBattle();
  render(state);

  // BACK BUTTON
  const backBtn = document.getElementById("back-btn");

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "../stage-1/index.html";
    });
  }

  // KEYBOARD (SOLO UNA VEZ)
  document.addEventListener("keydown", onKeyDown);

  // ATTACK BUTTONS (MOVES)
  document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("move-btn")) return;

    const index = Number(e.target.dataset.move);
    const move = state.player.moves[index];

    if (move) {
      playerAttack(move);
      render(state);
    }
  });

  // DEFINITIVE BUTTON
  const ultimateBtn = document.getElementById("ultimate-btn");

  if (ultimateBtn) {
    ultimateBtn.addEventListener("click", () => {
      useDefinitive();
      render(state);
    });
  }

  // RESET BUTTON
  const resetBtn = document.getElementById("reset-btn");

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      resetBattle();
    });
  }

  // ENEMY LOOP
  startEnemyLoop(render);
}

// ---------------------------
// RESET
// ---------------------------
function resetBattle() {
  state.playerHP = Math.floor(getStat(state.player, "hp") * 2.5);
  state.opponentHP = Math.floor(getStat(state.opponent, "hp") * 2.5);
  state.playerPosition = 2;
  state.locked = false;
  state.definitiveUsed = false;
  state.attackOnCooldown = false;
  state.phase = "fighting";
  state.log = [];
  state.incomingAttack = null;

  render(state);
  startEnemyLoop(render);
}

// ---------------------------
// HELPER
// ---------------------------
function getStat(pokemon, statName) {
  const stat = pokemon.stats.find(s => s.stat.name === statName);
  return stat ? stat.base_stat : 0;
}

// ---------------------------
// START
// ---------------------------
document.addEventListener("DOMContentLoaded", init);