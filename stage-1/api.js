const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";

export async function fetchPokemon(name, options = {}) {
  try {
    const res = await fetch(BASE_URL + name.toLowerCase(), options);

    if (!res.ok) {
      throw new Error("Pokemon not found");
    }

    const data = await res.json();
    return data;

  } catch (error) {
    //  IMPORTANTE: dejamos pasar AbortError sin romper nada
    if (error.name === "AbortError") {
      throw error;
    }

    throw error;
  }
}

export async function fetchMoves(moveUrls) {
  try {
    const promises = moveUrls.map((url) =>
      fetch(url).then((res) => {
        if (!res.ok) {
          throw new Error("Move fetch failed");
        }
        return res.json();
      })
    );

    const results = await Promise.allSettled(promises);

    return results
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value);

  } catch (error) {
    console.error("Error fetching moves", error);
    return [];
  }
}

export function getFirstMoves(pokemonData) {
  return pokemonData.moves.slice(0, 4).map((m) => m.move.url);
}

