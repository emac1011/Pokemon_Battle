import TRAINER from "../trainer.config.js";
import { fetchPokemon, fetchMoves, getFirstMoves } from "./api.js";
import { render } from "./render.js";

const state = {
  player: {
    data: null,
    moves: [],
    loading: false,
    error: null,
  },
  opponent: {
    data: null,
    moves: [],
    loading: false,
    error: null,
    search: "",
  },
};



async function loadPlayerPokemon() {
  state.player.loading = true;
  state.player.error = null;
  render(state);

  try {
    const data = await fetchPokemon(TRAINER.favoritePokemon);

    const moveUrls = getFirstMoves(data);
    const moves = await fetchMoves(moveUrls);

    state.player.data = data;
    state.player.moves = moves;

  } catch (error) {
    state.player.error = "Error loading your Pokémon";
  } finally {
    state.player.loading = false;
    render(state);
  }
}





function init() {
  loadPlayerPokemon();
  render(state);

  document.addEventListener("click", (e) => {
    if (e.target.id === "search-btn") {
      handleSearch();
    }
  });
}


async function handleSearch() {
  const input = document.getElementById("search-input");
  if (!input) return;

  const value = input.value.trim().toLowerCase();
  if (!value) return;

  state.opponent.loading = true;
  state.opponent.error = null;
  render(state);

  try {
    const data = await fetchPokemon(value);

    const moveUrls = getFirstMoves(data);
    const moves = await fetchMoves(moveUrls);

    state.opponent.data = data;
    state.opponent.moves = moves;

  } catch (error) {
    state.opponent.error = "Pokémon no encontrado";
    state.opponent.data = null;
    state.opponent.moves = [];
  } finally {
    state.opponent.loading = false;
    render(state);
  }
}

document.addEventListener("DOMContentLoaded", init);
