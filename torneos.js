const torneos = [
  // TORNEOS NACIONALES - PRIMERA DIVISIÓN
  {
    id: "torneo-peru",
    nombre: "Liga 1 Perú",
    pais: "Perú",
    tipo: "nacional",
    division: "primera",
    formato: "apertura_clausura",
    equipos: Array.from({length: 18}, (_, i) => `51-${i + 1}`),
    fases: [
      {
        nombre: "Torneo Apertura",
        tipo: "todos_contra_todos",
        partidos: "ida_vuelta",
        equipos_clasifican: 8,
        descripcion: "Fase regular del primer semestre"
      },
      {
        nombre: "Playoffs Apertura", 
        tipo: "eliminacion_directa",
        partidos: "ida_vuelta",
        equipos_participan: 8,
        descripcion: "Cuartos, Semifinales y Final del Apertura"
      },
      {
        nombre: "Torneo Clausura",
        tipo: "todos_contra_todos", 
        partidos: "ida_vuelta",
        equipos_clasifican: 8,
        descripcion: "Fase regular del segundo semestre"
      },
      {
        nombre: "Playoffs Clausura",
        tipo: "eliminacion_directa",
        partidos: "ida_vuelta", 
        equipos_participan: 8,
        descripcion: "Cuartos, Semifinales y Final del Clausura"
      },
      {
        nombre: "Final Nacional",
        tipo: "final",
        partidos: "ida_vuelta",
        equipos_participan: 2,
        descripcion: "Campeón Apertura vs Campeón Clausura (si son diferentes)"
      }
    ],
    temporada: "anual",
    ascensos: 2,
    descensos: 2
  },
  
  {
    id: "torneo-argentina", 
    nombre: "Liga Profesional Argentina",
    pais: "Argentina",
    tipo: "nacional",
    division: "primera",
    formato: "todos_contra_todos",
    equipos: Array.from({length: 28}, (_, i) => `54-${i + 1}`),
    fases: [
      {
        nombre: "Fase Regular",
        tipo: "todos_contra_todos",
        partidos: "solo_ida",
        jornadas: 27,
        descripcion: "Todos los equipos se enfrentan una vez"
      }
    ],
    temporada: "anual",
    ascensos: 2,
    descensos: 4,
    promedio_descenso: true
  },
  
  {
    id: "torneo-venezuela",
    nombre: "Primera División de Venezuela",
    pais: "Venezuela", 
    tipo: "nacional",
    division: "primera",
    formato: "apertura_clausura",
    equipos: Array.from({length: 14}, (_, i) => `58-${i + 1}`),
    fases: [
      {
        nombre: "Torneo Apertura",
        tipo: "todos_contra_todos",
        partidos: "ida_vuelta",
        jornadas: 26,
        descripcion: "Primera rueda del campeonato"
      },
      {
        nombre: "Torneo Clausura", 
        tipo: "todos_contra_todos",
        partidos: "ida_vuelta",
        jornadas: 26,
        descripcion: "Segunda rueda del campeonato"
      },
      {
        nombre: "Final",
        tipo: "final",
        partidos: "ida_vuelta",
        equipos_participan: 2,
        descripcion: "Campeón Apertura vs Campeón Clausura"
      }
    ],
    temporada: "anual",
    ascensos: 1,
    descensos: 2
  },
  
  {
    id: "torneo-colombia",
    nombre: "Liga BetPlay Dimayor",
    pais: "Colombia",
    tipo: "nacional", 
    division: "primera",
    formato: "apertura_clausura_playoffs",
    equipos: Array.from({length: 20}, (_, i) => `57-${i + 1}`),
    fases: [
      {
        nombre: "Fase Todos contra Todos",
        tipo: "todos_contra_todos",
        partidos: "solo_ida",
        jornadas: 19,
        descripcion: "Cada equipo juega una vez contra todos"
      },
      {
        nombre: "Cuadrangulares Semifinales",
        tipo: "grupos",
        grupos: 2,
        equipos_por_grupo: 4,
        partidos: "ida_vuelta",
        equipos_clasifican: 2,
        descripcion: "Los 8 mejores se dividen en 2 grupos de 4"
      },
      {
        nombre: "Final",
        tipo: "final", 
        partidos: "ida_vuelta",
        equipos_participan: 2,
        descripcion: "Ganadores de cada cuadrangular"
      }
    ],
    temporadas_por_año: 2,
    ascensos: 2,
    descensos: 2
  },
  
  {
    id: "torneo-paraguay",
    nombre: "División Profesional de Paraguay",
    pais: "Paraguay",
    tipo: "nacional",
    division: "primera", 
    formato: "apertura_clausura",
    equipos: Array.from({length: 12}, (_, i) => `592-${i + 1}`),
    fases: [
      {
        nombre: "Torneo Apertura",
        tipo: "todos_contra_todos",
        partidos: "ida_vuelta", 
        jornadas: 22,
        descripcion: "Primera rueda del año"
      },
      {
        nombre: "Torneo Clausura",
        tipo: "todos_contra_todos",
        partidos: "ida_vuelta",
        jornadas: 22, 
        descripcion: "Segunda rueda del año"
      },
      {
        nombre: "Final",
        tipo: "final",
        partidos: "ida_vuelta",
        equipos_participan: 2,
        descripcion: "Si hay diferentes campeones de Apertura y Clausura"
      }
    ],
    temporada: "anual",
    ascensos: 1,
    descensos: 2
  },
  
  {
    id: "torneo-chile",
    nombre: "Primera División de Chile",
    pais: "Chile",
    tipo: "nacional",
    division: "primera",
    formato: "todos_contra_todos",
    equipos: Array.from({length: 16}, (_, i) => `56-${i + 1}`),
    fases: [
      {
        nombre: "Fase Regular",
        tipo: "todos_contra_todos", 
        partidos: "ida_vuelta",
        jornadas: 30,
        descripcion: "Todos contra todos a doble rueda"
      }
    ],
    temporada: "anual",
    ascensos: 1,
    descensos: 2
  },
  
  {
    id: "torneo-bolivia", 
    nombre: "División Profesional de Bolivia",
    pais: "Bolivia",
    tipo: "nacional",
    division: "primera",
    formato: "apertura_clausura",
    equipos: Array.from({length: 16}, (_, i) => `591-${i + 1}`),
    fases: [
      {
        nombre: "Torneo Apertura",
        tipo: "todos_contra_todos",
        partidos: "solo_ida",
        jornadas: 15,
        descripcion: "Primera rueda del campeonato"
      },
      {
        nombre: "Torneo Clausura", 
        tipo: "todos_contra_todos",
        partidos: "solo_ida",
        jornadas: 15,
        descripcion: "Segunda rueda del campeonato"
      },
      {
        nombre: "Final",
        tipo: "final",
        partidos: "ida_vuelta", 
        equipos_participan: 2,
        descripcion: "Campeón Apertura vs Campeón Clausura"
      }
    ],
    temporada: "anual",
    ascensos: 0,
    descensos: 2
  },
  
  {
    id: "torneo-brasil",
    nombre: "Campeonato Brasileiro Série A",
    pais: "Brasil", 
    tipo: "nacional",
    division: "primera",
    formato: "todos_contra_todos",
    equipos: Array.from({length: 20}, (_, i) => `55-${i + 1}`),
    fases: [
      {
        nombre: "Fase Única",
        tipo: "todos_contra_todos",
        partidos: "ida_vuelta",
        jornadas: 38,
        descripcion: "Sistema de liga puro, todos contra todos"
      }
    ],
    temporada: "anual",
    ascensos: 4,
    descensos: 4,
    clasificacion_libertadores: 6,
    clasificacion_sudamericana: 6
  },
  
  {
    id: "torneo-ecuador",
    nombre: "Liga Pro de Ecuador",
    pais: "Ecuador",
    tipo: "nacional",
    division: "primera",
    formato: "etapa_regular_playoffs",
    equipos: Array.from({length: 16}, (_, i) => `593-${i + 1}`),
    fases: [
      {
        nombre: "Etapa Regular",
        tipo: "todos_contra_todos",
        partidos: "ida_vuelta", 
        jornadas: 30,
        equipos_clasifican: 8,
        descripcion: "Fase clasificatoria para playoffs"
      },
      {
        nombre: "Playoffs",
        tipo: "eliminacion_directa",
        partidos: "ida_vuelta",
        equipos_participan: 8,
        descripcion: "Cuartos, Semifinales y Final"
      }
    ],
    temporada: "anual",
    ascensos: 1,
    descensos: 2
  },
  
  {
    id: "torneo-uruguay",
    nombre: "Primera División de Uruguay", 
    pais: "Uruguay",
    tipo: "nacional",
    division: "primera",
    formato: "apertura_clausura_playoffs",
    equipos: Array.from({length: 16}, (_, i) => `598-${i + 1}`),
    fases: [
      {
        nombre: "Torneo Apertura",
        tipo: "todos_contra_todos",
        partidos: "solo_ida", 
        jornadas: 15,
        descripcion: "Primera rueda del campeonato"
      },
      {
        nombre: "Torneo Clausura",
        tipo: "todos_contra_todos",
        partidos: "solo_ida",
        jornadas: 15,
        descripcion: "Segunda rueda del campeonato"
      },
      {
        nombre: "Playoffs",
        tipo: "eliminacion_directa",
        partidos: "ida_vuelta",
        equipos_participan: 4,
        descripcion: "Los 4 mejores del acumulado si no hay bicampeón"
      }
    ],
    temporada: "anual",
    ascensos: 1,
    descensos: 2
  },

  // TORNEOS INTERNACIONALES
  {
    id: "copa-libertadores",
    nombre: "Copa Libertadores de América",
    pais: "Internacional",
    tipo: "internacional",
    division: "copa",
    formato: "grupos_eliminacion_directa",
    equipos: [
      // Argentina (6 equipos)
      "54-1", "54-2", "54-3", "54-4", "54-5", "54-6",
      // Brasil (8 equipos) 
      "55-1", "55-2", "55-3", "55-4", "55-5", "55-6", "55-7", "55-8",
      // Colombia (4 equipos)
      "57-1", "57-2", "57-3", "57-4",
      // Chile (4 equipos)
      "56-1", "56-2", "56-3", "56-4", 
      // Ecuador (4 equipos)
      "593-1", "593-2", "593-3", "593-4",
      // Perú (4 equipos)
      "51-1", "51-2", "51-3", "51-4",
      // Uruguay (4 equipos)
      "598-1", "598-2", "598-3", "598-4",
      // Paraguay (3 equipos)
      "592-1", "592-2", "592-3",
      // Bolivia (3 equipos)
      "591-1", "591-2", "591-3",
      // Venezuela (3 equipos)
      "58-1", "58-2", "58-3"
    ],
    fases: [
      {
        nombre: "Fase Previa",
        tipo: "eliminacion_directa",
        partidos: "ida_vuelta",
        equipos_participan: 6,
        equipos_clasifican: 3,
        descripcion: "Equipos de menor ranking pelean por 3 cupos"
      },
      {
        nombre: "Fase de Grupos",
        tipo: "grupos",
        grupos: 8,
        equipos_por_grupo: 4,
        partidos: "ida_vuelta",
        equipos_clasifican: 16,
        descripcion: "8 grupos de 4 equipos, clasifican los 2 primeros"
      },
      {
        nombre: "Octavos de Final",
        tipo: "eliminacion_directa",
        partidos: "ida_vuelta",
        equipos_participan: 16,
        equipos_clasifican: 8,
        descripcion: "Eliminación directa"
      },
      {
        nombre: "Cuartos de Final", 
        tipo: "eliminacion_directa",
        partidos: "ida_vuelta",
        equipos_participan: 8,
        equipos_clasifican: 4,
        descripcion: "Eliminación directa"
      },
      {
        nombre: "Semifinales",
        tipo: "eliminacion_directa", 
        partidos: "ida_vuelta",
        equipos_participan: 4,
        equipos_clasifican: 2,
        descripcion: "Eliminación directa"
      },
      {
        nombre: "Final",
        tipo: "final",
        partidos: "ida_vuelta",
        equipos_participan: 2,
        descripcion: "Partido decisivo del torneo"
      }
    ],
    temporada: "anual",
    duracion_meses: 10,
    premio_especial: "Clasificación al Mundial de Clubes FIFA"
  },
  
  {
    id: "copa-sudamericana",
    nombre: "Copa Sudamericana",
    pais: "Internacional", 
    tipo: "internacional",
    division: "copa",
    formato: "eliminacion_directa_pura",
    equipos: [
      // Argentina (6 equipos)
      "54-7", "54-8", "54-9", "54-10", "54-11", "54-12",
      // Brasil (8 equipos)
      "55-9", "55-10", "55-11", "55-12", "55-13", "55-14", "55-15", "55-16",
      // Colombia (6 equipos)
      "57-5", "57-6", "57-7", "57-8", "57-9", "57-10",
      // Chile (4 equipos)  
      "56-5", "56-6", "56-7", "56-8",
      // Ecuador (4 equipos)
      "593-5", "593-6", "593-7", "593-8",
      // Perú (4 equipos)
      "51-5", "51-6", "51-7", "51-8",
      // Uruguay (4 equipos)
      "598-5", "598-6", "598-7", "598-8",
      // Paraguay (4 equipos)
      "592-4", "592-5", "592-6", "592-7",
      // Bolivia (4 equipos)
      "591-4", "591-5", "591-6", "591-7",
      // Venezuela (4 equipos)
      "58-4", "58-5", "58-6", "58-7"
    ],
    fases: [
      {
        nombre: "Primera Fase",
        tipo: "eliminacion_directa",
        partidos: "ida_vuelta", 
        equipos_participan: 44,
        equipos_clasifican: 22,
        descripcion: "Eliminación directa para reducir participantes"
      },
      {
        nombre: "Segunda Fase",
        tipo: "eliminacion_directa",
        partidos: "ida_vuelta",
        equipos_participan: 32,
        equipos_clasifican: 16,
        descripcion: "Se incorporan equipos eliminados de Libertadores"
      },
      {
        nombre: "Octavos de Final",
        tipo: "eliminacion_directa",
        partidos: "ida_vuelta", 
        equipos_participan: 16,
        equipos_clasifican: 8,
        descripcion: "Eliminación directa"
      },
      {
        nombre: "Cuartos de Final",
        tipo: "eliminacion_directa",
        partidos: "ida_vuelta",
        equipos_participan: 8,
        equipos_clasifican: 4,
        descripcion: "Eliminación directa"
      },
      {
        nombre: "Semifinales",
        tipo: "eliminacion_directa",
        partidos: "ida_vuelta",
        equipos_participan: 4, 
        equipos_clasifican: 2,
        descripcion: "Eliminación directa"
      },
      {
        nombre: "Final",
        tipo: "final",
        partidos: "ida_vuelta",
        equipos_participan: 2,
        descripcion: "Partido decisivo del torneo"
      }
    ],
    temporada: "anual",
    duracion_meses: 8,
    premio_especial: "Clasificación a Recopa Sudamericana"
  },
  
  {
    id: "recopa-sudamericana",
    nombre: "Recopa Sudamericana", 
    pais: "Internacional",
    tipo: "internacional",
    division: "copa",
    formato: "partido_unico",
    equipos: [
      // Se define dinámicamente con los campeones del año anterior
      // "campeón_libertadores", "campeón_sudamericana"
    ],
    fases: [
      {
        nombre: "Final Única",
        tipo: "final",
        partidos: "ida_vuelta",
        equipos_participan: 2,
        descripcion: "Campeón de Copa Libertadores vs Campeón de Copa Sudamericana"
      }
    ],
    temporada: "anual",
    duracion_meses: 1,
    fecha_tradicional: "Febrero",
    condicion: "Solo se juega si hay campeones diferentes en Libertadores y Sudamericana"
  }
];

// Función para obtener torneos por tipo
const obtenerTorneosPorTipo = (tipo) => {
  return torneos.filter(torneo => torneo.tipo === tipo);
};

// Función para obtener torneo por país
const obtenerTorneoPorPais = (pais) => {
  return torneos.find(torneo => torneo.pais === pais && torneo.tipo === 'nacional');
};

// Función para obtener equipos de un torneo específico
const obtenerEquiposDeTorneo = (idTorneo) => {
  const torneo = torneos.find(t => t.id === idTorneo);
  return torneo ? torneo.equipos : [];
};

// Función para obtener formato de un torneo
const obtenerFormatoTorneo = (idTorneo) => {
  const torneo = torneos.find(t => t.id === idTorneo);
  return torneo ? {
    nombre: torneo.nombre,
    formato: torneo.formato,
    fases: torneo.fases,
    equipos_total: torneo.equipos.length
  } : null;
};

// Función para obtener torneos internacionales
const obtenerTorneosInternacionales = () => {
  return torneos.filter(torneo => torneo.tipo === 'internacional');
};

// Exportar todo
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    torneos,
    obtenerTorneosPorTipo,
    obtenerTorneoPorPais, 
    obtenerEquiposDeTorneo,
    obtenerFormatoTorneo,
    obtenerTorneosInternacionales
  };
}

// Para uso en navegador
if (typeof window !== 'undefined') {
  window.TorneosData = {
    torneos,
    obtenerTorneosPorTipo,
    obtenerTorneoPorPais,
    obtenerEquiposDeTorneo,
    obtenerFormatoTorneo,
    obtenerTorneosInternacionales
  };
}
