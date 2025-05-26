const ligaPeruana = {
  nombre: "Liga1 Te Apuesto 2025",
  nombreComercial: "Liga1 2025",
  patrocinador: "Te Apuesto",
  edicion: 109,
  equipos: 19,
  equiposAltura: 12,
  alturaMinima: 1000,
  partidosPorEquipo: 36,
  
  sistema: {
    grupoUnico: true,
    torneos: ["Apertura", "Clausura"],
    partidosPorTorneo: 18,
    enfrentamientos: {
      local: 1,
      visitante: 1
    }
  },
  
  puntuacion: {
    victoria: 3,
    empate: 1,
    derrota: 0
  },
  
  criteriosDesempate: [
    "Diferencia de goles",
    "Goles a favor", 
    "Fair Play (puntos descontados por tarjetas)",
    "Sorteo realizado por la Liga de Fútbol Profesional"
  ],
  
  criteriosDesempateAcumulada: [
    "Diferencia de goles",
    "Goles a favor",
    "Fair Play (puntos descontados por tarjetas)", 
    "Enfrentamientos directos",
    "Sorteo realizado por la Liga de Fútbol Profesional"
  ],
  
  // Campeones de torneos individuales
  campeonatos: {
    apertura: {
      tipo: "Torneo Apertura",
      campeon: "Primer lugar tabla Apertura",
      noHayDescenso: true,
      soloTitulo: true
    },
    clausura: {
      tipo: "Torneo Clausura", 
      campeon: "Primer lugar tabla Clausura",
      noHayDescenso: true,
      soloTitulo: true
    }
  },
  
  // Tabla acumulada (suma de ambos torneos)
  tablaAcumulada: {
    criterio: "Suma de puntos Apertura + Clausura",
    determina: [
      "Descensos",
      "Clasificación a copas internacionales",
      "Playoff (si aplica)"
    ]
  },
  
  playoff: {
    condicionCampeonDistinto: {
      participantes: 4,
      descripcion: "Campeones de Apertura y Clausura + 2 mejores de tabla acumulada"
    },
    condicionMismoCampeon: {
      campeonAutomatico: true,
      playoffSubcampeon: {
        participantes: 3,
        descripcion: "3 mejores equipos restantes de tabla acumulada"
      }
    },
    formatoSubcampeonato: [
      "3° vs 4° de tabla acumulada",
      "Ganador vs 2° de tabla acumulada"
    ]
  },
  
  clasificacionInternacional: {
    totalCupos: 8,
    criterio: "Tabla acumulada final",
    copaLibertadores: {
      cupos: 4,
      posiciones: {
        "Peru1": "Campeón nacional",
        "Peru2": "Subcampeón nacional", 
        "Peru3": "3° tabla acumulada",
        "Peru4": "4° tabla acumulada"
      }
    },
    copaSudamericana: {
      cupos: 4,
      posiciones: {
        "Peru1": "5° tabla acumulada",
        "Peru2": "6° tabla acumulada",
        "Peru3": "7° tabla acumulada", 
        "Peru4": "8° tabla acumulada"
      }
    }
  },
  
  descenso: {
    equiposDescienden: 3,
    posiciones: [17, 18, 19],
    criterio: "Tabla acumulada final",
    destino: "Liga 2 2026",
    noDescensoEnTorneos: {
      apertura: true,
      clausura: true,
      aclaracion: "Solo descienden por tabla acumulada"
    }
  }
};

export { ligaPeruana };
