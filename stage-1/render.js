
function renderPlayer(player) {
  const container = document.getElementById("player");

  if (!container) return;

  if (player.loading) {
    container.innerHTML = `<p>Cargando tu Pokémon...</p>`;
    return;
  }

  if (player.error) {
    container.innerHTML = `<p>${player.error}</p>`;
    return;
  }

  if (!player.data) {
    container.innerHTML = `<p>No hay datos</p>`;
    return;
  }

  container.innerHTML = `
    <h2>${player.data.name.toUpperCase()}</h2>
    <img src="${player.data.sprites.front_default}" />
    <p>HP: ${getStat(player.data, "hp")}</p>
    <p>Attack: ${getStat(player.data, "attack")}</p>
    <p>Defense: ${getStat(player.data, "defense")}</p>
    <p>Speed: ${getStat(player.data, "speed")}</p>

    <h3>Moves</h3>
    <ul>
      ${player.moves.map(m => `<li>${m.name}</li>`).join("")}
    </ul>
  `;
}



function getStat(pokemon, statName) {
  const stat = pokemon.stats.find(s => s.stat.name === statName);
  return stat ? stat.base_stat : "-";
}



import TRAINER from "../trainer.config.js";



function renderTrainer() {
  document.getElementById("trainer-name").textContent = `Name: ${TRAINER.name}`;
  document.getElementById("trainer-hometown").textContent = `From: ${TRAINER.hometown}`;
  document.getElementById("trainer-phrase").textContent = `"${TRAINER.catchphrase}"`;
}



function renderOpponent(opponent) {
  const container = document.getElementById("opponent");

  if (!container) return;

  if (opponent.loading) {
    container.innerHTML = `<p>Buscando oponente...</p>`;
    return;
  }

  if (opponent.error) {
    container.innerHTML = `<p>${opponent.error}</p>`;
    return;
  }

  if (!opponent.data) {
    container.innerHTML = `
      <h2>Buscar Oponente</h2>
      <input type="text" id="search-input" placeholder="Nombre del Pokémon" />
      <button id="search-btn">Buscar</button>
      <p id="search-error"></p>
    `;
    return;
  }

  container.innerHTML = `
    <h2>${opponent.data.name.toUpperCase()}</h2>
    <img src="${opponent.data.sprites.front_default}" />
    <p>HP: ${getStat(opponent.data, "hp")}</p>
    <p>Attack: ${getStat(opponent.data, "attack")}</p>
    <p>Defense: ${getStat(opponent.data, "defense")}</p>
    <p>Speed: ${getStat(opponent.data, "speed")}</p>

    <h3>Moves</h3>
    <ul>
      ${opponent.moves.map(m => `<li>${m.name}</li>`).join("")}
    </ul>
  `;
}

function applyTypeTheme(player) {
  if (!player.data) return;

  const type = player.data.types?.[0]?.type?.name;
  if (!type) return;

  document.body.dataset.type = type;
}

export function render(state) {
  renderTrainer();
  renderPlayer(state.player);
  renderOpponent(state.opponent);
  applyTypeTheme(state.player);
}