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

let searchTimeout = null;
let currentController = null;

// --- Cargar Pokémon del jugador ---
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
    state.player.error = "Error cargando tu Pokémon";
  } finally {
    state.player.loading = false;
    render(state);
  }
}

// --- Cargar Pokémon del oponente ---
async function loadOpponentPokemon(name) {
  if (!name) return;

  // Cancelar búsqueda anterior
  if (currentController) currentController.abort();
  currentController = new AbortController();
  const signal = currentController.signal;

  state.opponent.loading = true;
  state.opponent.error = null;
  render(state);

  try {
    const data = await fetchPokemon(name, { signal });
    const moveUrls = getFirstMoves(data);
    const moves = await fetchMoves(moveUrls);

    state.opponent.data = data;
    state.opponent.moves = moves;
    state.opponent.search = name;

    // Guardar en localStorage
    localStorage.setItem("lastOpponent", name);
  } catch (error) {
    if (error.name === "AbortError") return;
    state.opponent.error = "Pokémon no encontrado";
    state.opponent.data = null;
    state.opponent.moves = [];
  } finally {
    state.opponent.loading = false;
    render(state);
  }
}



// --- Debounce helper ---
function debounce(fn, delay = 400) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// --- Manejo de input y botones ---
function init() {
  loadPlayerPokemon();

  const input = document.getElementById("search-input");
  const btn = document.getElementById("search-btn");

  if (input) {
    input.addEventListener(
      "keyup",
      debounce(() => {
        const value = input.value.trim().toLowerCase();
        if (value) loadOpponentPokemon(value);
      }, 400)
    );
  }

  if (btn) {
    btn.addEventListener("click", () => {
      const value = input.value.trim().toLowerCase();
      if (value) loadOpponentPokemon(value);
    });
  }


  // Cargar último oponente guardado
  const lastOpponent = localStorage.getItem("lastOpponent");
  if (lastOpponent) {
    loadOpponentPokemon(lastOpponent);
    if (input) input.value = lastOpponent;
  }
}



document.addEventListener("DOMContentLoaded", init);