import { state, initBattle, startEnemyLoop, playerAttack, useDefinitive } from "./battle.js";
import { render } from "./render.js";

// ---------------------------
// KEYBOARD HANDLER (OBLIGATORIO)
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

  //  Registrar UNA SOLA VEZ
  document.addEventListener("keydown", onKeyDown);

  // ---------------------------
  // ATTACK BUTTON
  // ---------------------------
  const attackBtn = document.getElementById("attack-btn");

  if (attackBtn) {
    attackBtn.addEventListener("click", () => {
      if (!state.player || !state.player.moves?.length) return;

      const move = state.player.moves[0]; // usamos el primer move
      playerAttack(move);
      render(state);
    });
  }

  // ---------------------------
  // DEFINITIVE BUTTON
  // ---------------------------
  const ultimateBtn = document.getElementById("ultimate-btn");

  if (ultimateBtn) {
    ultimateBtn.addEventListener("click", () => {
      useDefinitive();
      render(state);
    });
  }

  // ---------------------------
  // RESET BUTTON
  // ---------------------------
  const resetBtn = document.getElementById("reset-btn");

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      resetBattle();
    });
  }

  // ---------------------------
  // START ENEMY LOOP
  // ---------------------------
  startEnemyLoop(render);
}

// ---------------------------
// RESET (OBLIGATORIO)
// ---------------------------
function resetBattle() {
  // reset state manual (sin recargar)
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

// helper duplicado (simple)
function getStat(pokemon, statName) {
  const stat = pokemon.stats.find(s => s.stat.name === statName);
  return stat ? stat.base_stat : 0;
}

// ---------------------------
document.addEventListener("DOMContentLoaded", init);