// ligaperuana.js
//
// Módulo con la lógica completa del torneo Liga1 Te Apuesto 2025
// Incluye formato, reglas de puntuación, clasificación, playoffs y descensos
// Integra fixtures de Apertura, Clausura y Playoffs
//

const ligaPeruana = {
  nombre: "Liga1 Te Apuesto 2025",
  nombreComercial: "Liga1 2025",
  patrocinador: "Te Apuesto",
  equipos: 18, // Corregido: son 18 equipos (51-1 al 51-18)

  // Fixtures importados - SE CARGAN DINÁMICAMENTE
  get fixtures() {
    return {
      apertura: window.fixtureApertura || { fechas: [] },
      clausura: window.fixtureClausura || { fechas: [] },
      playoffs: window.fixturePlayoffs || { semifinales: { partidos: [] }, final: { partidos: [] } }
    };
  },

  // Fechas oficiales para Apertura y Clausura
  fechas: {
    apertura: {
      inicio: "2025-01-28",  // Último fin de semana de enero
      fin: "2025-05-25"      // Corregido según fixture
    },
    clausura: {
      inicio: "2025-07-15",  // Tras la final de Copa América
      fin: "2025-11-09"      // Corregido según fixture
    },
    playoffs: {
      inicio: "2025-12-03",  // Inicio semifinales
      fin: "2025-12-17"      // Final vuelta
    }
  },

  // Puntuación para partidos
  puntuacion: {
    victoria: 3,
    empate: 1,
    derrota: 0
  },

  // Formato general del torneo
  formato: {
    tipo: "doble torneo",
    descripcion: `Dos torneos (Apertura y Clausura), todos contra todos a una vuelta.  
    Los ganadores avanzan a playoffs siempre que estén entre los 7 mejores en el otro torneo.  
    Los otros dos clasificados son los mejores en tabla acumulada.  
    Si un equipo gana ambos torneos, es campeón directo.  
    Si campeones Apertura y Clausura son 1º y 2º en acumulada, acceso directo a final.  
    Playoffs con semifinales y final ida y vuelta.`
  },

  // Criterios para desempates en tablas
  criteriosDesempate: [
    "Diferencia de goles",
    "Goles a favor",
    "Fair Play (puntos descontados por tarjetas)",
    "Sorteo determinado por la Liga"
  ],

  // Clasificación, tabla acumulada y descensos
  tablaAcumulada: {
    criterio: "Suma puntos Apertura + Clausura",
    determina: [
      "Descensos",
      "Clasificación a copas internacionales",
      "Playoffs (si aplica)"
    ]
  },

  descensos: {
    cantidad: 2,
    criterio: "Últimos 2 equipos de tabla acumulada descienden"
  },

  clasificacionInternacional: {
    copaLibertadores: {
      cupos: 4,
      posiciones: [
        "Campeón nacional",
        "Subcampeón nacional",
        "3º tabla acumulada",
        "4º tabla acumulada"
      ]
    },
    copaSudamericana: {
      cupos: 4,
      posiciones: [
        "5º tabla acumulada",
        "6º tabla acumulada",
        "7º tabla acumulada",
        "8º tabla acumulada"
      ]
    }
  },

  // MÉTODOS PARA MANEJAR FIXTURES

  // Obtener fixture completo de un torneo
  obtenerFixture(torneo) {
    return this.fixtures[torneo] || null;
  },

  // Obtener partidos de una fecha específica
  obtenerPartidosFecha(torneo, numeroFecha) {
    const fixture = this.fixtures[torneo];
    if (!fixture) return null;
    
    const fecha = fixture.fechas?.find(f => f.numero === numeroFecha);
    return fecha ? fecha.partidos : null;
  },

  // Obtener un partido específico por ID
  obtenerPartidoPorId(partidoId) {
    for (const torneo of ['apertura', 'clausura', 'playoffs']) {
      const fixture = this.fixtures[torneo];
      
      if (torneo === 'playoffs') {
        // Buscar en semifinales y final
        const partidoSemi = fixture.semifinales.partidos.find(p => p.id === partidoId);
        if (partidoSemi) return partidoSemi;
        
        const partidoFinal = fixture.final.partidos.find(p => p.id === partidoId);
        if (partidoFinal) return partidoFinal;
      } else {
        // Buscar en fechas regulares
        for (const fecha of fixture.fechas) {
          const partido = fecha.partidos.find(p => p.id === partidoId);
          if (partido) return partido;
        }
      }
    }
    return null;
  },

  // Obtener próximos partidos de un equipo
  obtenerProximosPartidos(equipoId, limite = 5) {
    const proximosPartidos = [];
    const hoy = new Date();
    
    for (const torneo of ['apertura', 'clausura', 'playoffs']) {
      const fixture = this.fixtures[torneo];
      
      if (torneo === 'playoffs') {
        // Verificar semifinales y final
        [...fixture.semifinales.partidos, ...fixture.final.partidos].forEach(partido => {
          if ((partido.local === equipoId || partido.visitante === equipoId) && 
              new Date(partido.fecha) >= hoy && !partido.resultado) {
            proximosPartidos.push({ ...partido, torneo });
          }
        });
      } else {
        // Verificar fechas regulares
        fixture.fechas.forEach(fecha => {
          fecha.partidos.forEach(partido => {
            if ((partido.local === equipoId || partido.visitante === equipoId) && 
                new Date(partido.fecha) >= hoy && !partido.resultado) {
              proximosPartidos.push({ ...partido, torneo, fecha: fecha.numero });
            }
          });
        });
      }
    }
    
    return proximosPartidos
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
      .slice(0, limite);
  },

  // Función que verifica si un club ganó Apertura y Clausura y es campeón directo
  esCampeonDirecto(campeonApertura, campeonClausura) {
    return campeonApertura === campeonClausura;
  },

  // Función que verifica si ganadores de Apertura y Clausura están 1° y 2° en acumulada
  esFinalDirecta(campeonApertura, campeonClausura, tablaAcumulada) {
    if (!Array.isArray(tablaAcumulada) || tablaAcumulada.length < 2) return false;
    const primerLugar = tablaAcumulada[0].clubId;
    const segundoLugar = tablaAcumulada[1].clubId;
    return (
      (campeonApertura === primerLugar && campeonClausura === segundoLugar) ||
      (campeonClausura === primerLugar && campeonApertura === segundoLugar)
    );
  },

  // Función que define la estructura de playoffs o campeón directo
  obtenerEstructuraPlayoffs(campeonApertura, campeonClausura, tablaAcumulada) {
    if (this.esCampeonDirecto(campeonApertura, campeonClausura)) {
      return {
        tipo: "campeonDirecto",
        campeon: campeonApertura,
        descripcion: "Campeón directo: ganó Apertura y Clausura",
        partidos: []
      };
    }

    if (this.esFinalDirecta(campeonApertura, campeonClausura, tablaAcumulada)) {
      // Configurar final directa en fixture de playoffs
      if (this.fixtures.playoffs.asignarFinal) {
        this.fixtures.playoffs.asignarFinal(campeonApertura, campeonClausura, {
          [campeonApertura]: 0, // Posición 1
          [campeonClausura]: 1  // Posición 2
        });
      }
      
      return {
        tipo: "finalDirecta",
        finalistas: [campeonApertura, campeonClausura],
        descripcion: "Final directa: campeones de Apertura y Clausura, primeros dos en acumulada",
        partidos: this.fixtures.playoffs.final.partidos
      };
    }

    // Playoffs normales: 4 participantes
    let participantes = [campeonApertura, campeonClausura];
    tablaAcumulada.forEach((club) => {
      if (participantes.length < 4 && !participantes.includes(club.clubId)) {
        participantes.push(club.clubId);
      }
    });

    // Ordenar participantes según tabla acumulada
    participantes.sort((a, b) => {
      const posA = tablaAcumulada.findIndex((c) => c.clubId === a);
      const posB = tablaAcumulada.findIndex((c) => c.clubId === b);
      return posA - posB;
    });

    // Configurar semifinales en fixture de playoffs
    if (this.fixtures.playoffs.asignarSemifinales) {
      this.fixtures.playoffs.asignarSemifinales(participantes);
    }

    return {
      tipo: "playoffs",
      descripcion: "Playoffs con semifinales y final ida y vuelta",
      participantes: participantes,
      semifinales: this.fixtures.playoffs.semifinales.partidos,
      final: this.fixtures.playoffs.final.partidos
    };
  }
};

// Export tradicional para navegador
window.ligaPeruana = ligaPeruana;
