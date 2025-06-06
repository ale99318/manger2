// ligaperuana.js
//
// Módulo con la lógica completa del torneo Liga1 Te Apuesto 2025
// Incluye formato, reglas de puntuación, clasificación, playoffs y descensos
// Integra fixtures de Apertura, Clausura y Playoffs
//

import { fixtureApertura } from './fixtures/fixtureApertura.js';
import { fixtureClausura } from './fixtures/fixtureClausura.js';
import { fixturePlayoffs } from './fixtures/fixturePlayoffs.js';

const ligaPeruana = {
  nombre: "Liga1 Te Apuesto 2025",
  nombreComercial: "Liga1 2025",
  patrocinador: "Te Apuesto",
  equipos: 18, // Corregido: son 18 equipos (51-1 al 51-18)

  // Fixtures importados
  fixtures: {
    apertura: fixtureApertura,
    clausura: fixtureClausura,
    playoffs: fixturePlayoffs
  },

  // ... resto del código que te envié anteriormente
