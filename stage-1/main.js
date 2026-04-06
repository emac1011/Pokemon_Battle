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