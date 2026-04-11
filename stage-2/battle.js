import TRAINER from "../trainer.config.js";

// ---------------------------
// STATE
// ---------------------------
export const state = {
  ultimateOnCooldown: false,
  playerHP: 0,
  opponentHP: 0,
  playerPosition: 2,
  locked: false,
  definitiveUsed: false,
  attackOnCooldown: false,
  phase: "fighting",
  log: [],
  incomingAttack: null,
  player: null,
  opponent: null,

  // UI effects
  hitEffect: null,
};

// ---------------------------
// RENDER INJECTION
// ---------------------------
let renderFn = null;

export function setRender(fn) {
  renderFn = fn;
}

// ---------------------------
// TIMERS
// ---------------------------
let attackTimeout = null;

// ---------------------------
// INIT
// ---------------------------
export function initBattle() {
  const playerStored = JSON.parse(localStorage.getItem("playerData"));
  const opponentStored = JSON.parse(localStorage.getItem("opponentData"));

  const player = playerStored.data;
  const opponent = opponentStored.data;

  state.player = {
    ...player,
    moves: playerStored.moves || [],
  };

  state.opponent = {
    ...opponent,
    moves: opponentStored.moves || [],
  };

  state.playerHP = Math.floor(getStat(player, "hp") * 2.5);
  state.opponentHP = Math.floor(getStat(opponent, "hp") * 2.5);

  state.log.push("Battle started!");
}

// ---------------------------
// HELPERS
// ---------------------------
function getStat(pokemon, statName) {
  const stat = pokemon.stats.find((s) => s.stat.name === statName);
  return stat ? stat.base_stat : 0;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------
// DAMAGE
// ---------------------------
export function calcPlayerDamage(move) {
  const power = move.power || 60;

  return (
    Math.floor(power * 0.3) +
    Math.floor(Math.random() * power * 0.4)
  );
}

export function calcEnemyDamage() {
  const attackStat = getStat(state.opponent, "attack");

  return (
    Math.floor(attackStat * 0.4) +
    Math.floor(Math.random() * 20)
  );
}

// ---------------------------
// PLAYER ATTACK
// ---------------------------
export function playerAttack(move) {
  if (state.attackOnCooldown || state.phase !== "fighting") return;
  if (!move) return;

  const damage = calcPlayerDamage(move);
  state.opponentHP -= damage;

  const moveName = move?.name || "Unknown move";
  state.log.push(`You used ${moveName}! (${damage} dmg)`);

  startCooldown();
  startUltimateCooldown(); //  FIX IMPORTANTE

  checkBattleEnd();
  renderFn && renderFn(state);
}

// ---------------------------
// DEFINITIVE MOVE
// ---------------------------
export function useDefinitive() {
  if (state.definitiveUsed || state.phase !== "fighting") return;
  if (state.ultimateOnCooldown) return;

  state.definitiveUsed = true;
  state.opponentHP = 0;

  state.log.push(
    `${TRAINER.ultimateMoveName} — ${TRAINER.ultimateMoveFlavor}`
  );

  checkBattleEnd();
  renderFn && renderFn(state);
}

// ---------------------------
// ENEMY LOOP
// ---------------------------
export function startEnemyLoop(render) {
  setRender(render);
  scheduleNextAttack();
}

function scheduleNextAttack() {
  const delay = (2 + Math.random() * 2) * 1000; //  2–4s

  attackTimeout = setTimeout(async () => {
    await resolveEnemyAttack();

    if (state.phase === "fighting") {
      scheduleNextAttack();
    }
  }, delay);
}

// ---------------------------
// ENEMY ATTACK
// ---------------------------
async function resolveEnemyAttack() {
  const targetCell = Math.floor(Math.random() * 3) + 1;

  state.incomingAttack = targetCell;
  state.locked = false;

  renderFn && renderFn(state);

  await wait(600);

  state.locked = true;

  const hit = state.playerPosition === targetCell;
  const dmg = hit ? calcEnemyDamage() : 0;

  if (hit) {
    state.playerHP -= dmg;
    state.log.push(`💥 Hit! -${dmg}`);
    state.hitEffect = "hit";
  } else {
    state.log.push("✨ Dodged!");
    state.hitEffect = "dodge";
  }

  state.incomingAttack = null;

  renderFn && renderFn(state);

  setTimeout(() => {
    state.hitEffect = null;
    renderFn && renderFn(state);
  }, 200);

  state.locked = false;

  checkBattleEnd();
  renderFn && renderFn(state);
}

// ---------------------------
// COOLDOWN (ATAQUES NORMALES MÁS LENTOS)
// ---------------------------
function startCooldown() {
  state.attackOnCooldown = true;

  const duration = 3500 + Math.random() * 2500; //  más lento
  const start = performance.now();

  function tick(now) {
    const pct = Math.min((now - start) / duration, 1);

    const bar = document.getElementById("cooldown-bar");
    if (bar) {
      bar.style.width = `${(1 - pct) * 100}%`;
    }

    if (pct < 1) {
      requestAnimationFrame(tick);
    } else {
      state.attackOnCooldown = false;
    }
  }

  requestAnimationFrame(tick);
}

// ---------------------------
// ULTIMATE COOLDOWN (FIX REAL)
// ---------------------------
function startUltimateCooldown() {
  if (state.ultimateOnCooldown) return;

  state.ultimateOnCooldown = true;

  const duration = 5000;

  setTimeout(() => {
    state.ultimateOnCooldown = false;
    renderFn && renderFn(state);
  }, duration);
}

// ---------------------------
// END BATTLE
// ---------------------------
function checkBattleEnd() {
  if (state.playerHP <= 0 || state.opponentHP <= 0) {
    state.phase = "ended";

    clearTimeout(attackTimeout);

    if (state.playerHP <= 0) {
      state.log.push(TRAINER.loseMessage);
    } else {
      state.log.push(TRAINER.winMessage);
    }

    renderFn && renderFn(state);
  }
}

