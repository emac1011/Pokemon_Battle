# ⚡ Mi Batalla Pokémon

Aplicación de batalla Pokémon en JavaScript puro usando PokeAPI.  
El proyecto está dividido en dos fases: selección de equipo y combate en tiempo real.

---

## 👤 Entrenador

- Nombre: (TU NOMBRE)
- Ciudad natal: (TU CIUDAD)
- Frase característica: "(TU FRASE)"

---

## 🔥 Pokémon favorito

Mi Pokémon favorito es Hydreigon porque representa fuerza, caos y estrategia.  
Me gusta su diseño oscuro y su estilo agresivo en combate.

---

## 💥 Movimiento definitivo

Nombre: (TU ULTIMATE MOVE NAME)

Descripción:  
Un ataque final que representa el poder máximo del entrenador.

Inspiración:  
Basado en la idea de un ataque sin escape que termina la batalla instantáneamente.

---

## 🧩 Conceptos principales

### 1. Gestión de estado global
- Stage 1: `main.js`
- Stage 2: `battle.js`
- Todo el render depende de un único objeto `state`

---

### 2. Llamadas asíncronas a API
- `stage-1/api.js`
- Uso de `async/await`
- `Promise.allSettled` para movimientos
- `AbortController` para búsquedas

---

### 3. Sistema de batalla en tiempo real
- `stage-2/battle.js`
- Ataques enemigos con `setTimeout` recursivo
- Movimiento del jugador en 3 posiciones
- Sistema de daño dinámico y cooldown con `requestAnimationFrame`

---

## ⚠️ Problemas conocidos

- Pequeñas optimizaciones pendientes en limpieza de eventos
- Algunas animaciones son básicas
- El balance de daño es aleatorio por diseño

---

## 🚀 Deploy

GitHub Pages:  
(TU LINK AQUÍ)

---

## 📁 Estructura

- `stage-1/` → selección de Pokémon
- `stage-2/` → batalla en tiempo real
- `trainer.config.js` → configuración personal
- `index.html` → navegación principal