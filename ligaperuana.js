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
    copaLibertadores: {
      cupos: 4,
      posiciones: {
        "Peru1": "Campeón",
        "Peru2": "Subcampeón", 
        "Peru3": "Tercer lugar",
        "Peru4": "Cuarto lugar"
      }
    },
    copaSudamericana: {
      cupos: 4,
      posiciones: {
        "Peru1": "Quinto lugar",
        "Peru2": "Sexto lugar",
        "Peru3": "Séptimo lugar", 
        "Peru4": "Octavo lugar"
      }
    }
  },
  
  descenso: {
    equiposDescienden: 3,
    posiciones: [17, 18, 19],
    criterio: "Tabla acumulada",
    destino: "Liga 2 2026"
  }
};

export { ligaPeruana };
