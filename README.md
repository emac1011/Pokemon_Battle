# 🎮 Pokémon Battle Project

Proyecto de batalla Pokémon en dos etapas (Stage 1 y Stage 2) utilizando JavaScript vanilla, PokeAPI y manipulación avanzada del DOM.

---

## 🚀 Demo

🎥 Video explicación del proyecto ( 5 min):
https://www.loom.com/share/bc246d100805434e8491b972ff1de0e1

 Versión en vivo (GitHub Pages):


---

## 📌 Descripción

Este proyecto simula una batalla Pokémon interactiva donde el usuario puede:

- Buscar Pokémon usando la PokeAPI
- Ver estadísticas, sprites y movimientos
- Seleccionar un oponente
- Iniciar una batalla en tiempo real
- Luchar contra un enemigo con sistema de vida y daño
- Usar ataques normales y un ataque ultimate
- Ver animaciones y efectos visuales en combate

---

## 🧠 Arquitectura del proyecto

El proyecto está dividido en dos etapas:

### 🔹 Stage 1 – Selección y preparación
- Consumo de PokeAPI (`fetchPokemon`, `fetchMoves`)
- Manejo de estado del jugador y oponente
- Render modular (`render.js`)
- Sistema de búsqueda con debounce
- Persistencia con `localStorage`
- Botón de transición a batalla

### 🔹 Stage 2 – Sistema de batalla
- Sistema de combate en tiempo real
- HP dinámico para jugador y enemigo
- Ataques con cálculo de daño aleatorio
- Sistema de cooldown para ataques
- Loop automático de ataques del enemigo
- Posicionamiento en arena (3 lanes)
- Log de batalla en vivo
- Efectos visuales (hit / dodge / shake)
- Ultimate move con condición de uso

---

## ⚙️ Tecnologías usadas

- HTML5
- CSS3 (Grid + animaciones)
- JavaScript (ES Modules)
- PokeAPI
- LocalStorage

---

## 🎯 Features destacadas

- Arquitectura basada en estado centralizado
- Render manual optimizado (sin frameworks)
- Sistema de combate en tiempo real
- IA básica de enemigo con ataques automáticos
- UX con feedback visual (cooldowns, animaciones, logs)

---

## 💡 Puntos retadores

- Sincronización entre estado del juego y render UI
- Manejo de timers (cooldowns + enemigo + animaciones)
- Control de estado global sin librerías externas

---

## 📁 Cómo ejecutar

1. Clonar el repositorio
2. Abrir `stage-1/index.html`
3. Buscar un Pokémon
4. Iniciar batalla desde el botón