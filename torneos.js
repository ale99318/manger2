// Definimos los rangos de cada torneo
const torneos = {
  peru: { inicio: "51-1", fin: "51-18", lista: "lista-peru" },
  argentina: { inicio: "54-1", fin: "54-28", lista: "lista-argentina" },
  venezuela: { inicio: "58-1", fin: "58-14", lista: "lista-venezuela" },
  colombia: { inicio: "57-1", fin: "57-20", lista: "lista-colombia" },
  paraguay: { inicio: "595-2", fin: "595-12", lista: "lista-paraguay" },
  chile: { inicio: "56-1", fin: "56-16", lista: "lista-chile" },
  bolivia: { inicio: "591-1", fin: "591-16", lista: "lista-bolivia" },
  brasil: { inicio: "55-1", fin: "55-20", lista: "lista-brasil" },
  ecuador: { inicio: "593-1", fin: "593-16", lista: "lista-ecuador" },
  uruguay: { inicio: "598-1", fin: "598-16", lista: "lista-uruguay" }
};

// Definición de la Liga Peruana
const ligaPeruana = {
  nombre: "Liga1 Te Apuesto 2025",
  nombreComercial: "Liga1 2025",
  patrocinador: "Te Apuesto",
  edicion: 109,
  equipos: 19,
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

// Función para separar clubes por torneos
function separarPorTorneos(clubes) {
  const clubSeleccionadoId = localStorage.getItem("selectedClub");
  let torneoAsignado = null;

  Object.keys(torneos).forEach(pais => {
    const torneo = torneos[pais];
    const lista = document.getElementById(torneo.lista);
    
    // Limpiamos la lista
    lista.innerHTML = "";
    
    console.log(`\n=== TORNEO ${pais.toUpperCase()} ===`);
    
    const clubesDelTorneo = clubes.filter(club => 
      estaEnRango(club.id, torneo.inicio, torneo.fin)
    );
    
    clubesDelTorneo.forEach(club => {
      const li = document.createElement("li");
      li.textContent = club.nombre;
      lista.appendChild(li);
      
      console.log("ID:", club.id);
      console.log("Nombre:", club.nombre);
      
      if (club.id === clubSeleccionadoId) {
        torneoAsignado = pais; // Asignar el torneo correspondiente
      }
    });
    
    if (clubesDelTorneo.length === 0) {
      console.log("No se encontraron clubes para este torneo");
    }
  });

  // Retornar el torneo asignado para el club seleccionado
  return torneoAsignado;
}

// Ejecutar la función
const torneoDelClubSeleccionado = separarPorTorneos(clubes);
console.log("Torneo asignado al club seleccionado:", torneoDelClubSeleccionado);

// Exportar la liga peruana y la función
export { ligaPeruana, separarPorTorneos };
