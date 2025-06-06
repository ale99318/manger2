// manger2/torneos/fixtures/fixturePlayoffs.js

const fixturePlayoffs = {
  torneo: "Playoffs Liga1 2025",
  
  semifinales: {
    fechaInicio: "2025-12-03",
    fechaFin: "2025-12-10",
    partidos: [
      // Semifinal 1 - Ida
      {
        id: 307,
        fase: "semifinal",
        partido: "ida",
        semifinal: 1,
        local: null, // Se definirá según clasificación
        visitante: null, // Se definirá según clasificación
        fecha: "2025-12-03",
        hora: "20:00",
        resultado: null
      },
      // Semifinal 2 - Ida
      {
        id: 308,
        fase: "semifinal",
        partido: "ida",
        semifinal: 2,
        local: null, // Se definirá según clasificación
        visitante: null, // Se definirá según clasificación
        fecha: "2025-12-04",
        hora: "20:00",
        resultado: null
      },
      // Semifinal 1 - Vuelta
      {
        id: 309,
        fase: "semifinal",
        partido: "vuelta",
        semifinal: 1,
        local: null, // Se definirá según clasificación (visitante de ida)
        visitante: null, // Se definirá según clasificación (local de ida)
        fecha: "2025-12-07",
        hora: "20:00",
        resultado: null
      },
      // Semifinal 2 - Vuelta
      {
        id: 310,
        fase: "semifinal",
        partido: "vuelta",
        semifinal: 2,
        local: null, // Se definirá según clasificación (visitante de ida)
        visitante: null, // Se definirá según clasificación (local de ida)
        fecha: "2025-12-08",
        hora: "20:00",
        resultado: null
      }
    ]
  },

  final: {
    fechaInicio: "2025-12-14",
    fechaFin: "2025-12-21",
    partidos: [
      // Final - Ida
      {
        id: 311,
        fase: "final",
        partido: "ida",
        local: null, // Ganador semifinal con mejor posición en acumulada
        visitante: null, // Ganador otra semifinal
        fecha: "2025-12-14",
        hora: "20:00",
        resultado: null
      },
      // Final - Vuelta
      {
        id: 312,
        fase: "final",
        partido: "vuelta",
        local: null, // Visitante de ida
        visitante: null, // Local de ida
        fecha: "2025-12-17",
        hora: "20:00",
        resultado: null
      }
    ]
  },

  // Función para asignar equipos a semifinales
  asignarSemifinales(participantes) {
    // participantes debe ser array ordenado por tabla acumulada
    // [1°, 2°, 3°, 4°] donde pueden incluir campeones Apertura/Clausura
    
    this.semifinales.partidos[0].local = participantes[0]; // 1° vs 4°
    this.semifinales.partidos[0].visitante = participantes[3];
    this.semifinales.partidos[2].local = participantes[3]; // Vuelta
    this.semifinales.partidos[2].visitante = participantes[0];
    
    this.semifinales.partidos[1].local = participantes[1]; // 2° vs 3°
    this.semifinales.partidos[1].visitante = participantes[2];
    this.semifinales.partidos[3].local = participantes[2]; // Vuelta
    this.semifinales.partidos[3].visitante = participantes[1];
  },

  // Función para asignar equipos a final
  asignarFinal(ganadorSemi1, ganadorSemi2, posicionAcumulada) {
    // Determinar quién juega de local en ida según mejor posición en acumulada
    const localIda = posicionAcumulada[ganadorSemi1] < posicionAcumulada[ganadorSemi2] 
      ? ganadorSemi1 : ganadorSemi2;
    const visitanteIda = localIda === ganadorSemi1 ? ganadorSemi2 : ganadorSemi1;
    
    this.final.partidos[0].local = localIda;
    this.final.partidos[0].visitante = visitanteIda;
    this.final.partidos[1].local = visitanteIda; // Se invierte en vuelta
    this.final.partidos[1].visitante = localIda;
  }
};

export { fixturePlayoffs };
