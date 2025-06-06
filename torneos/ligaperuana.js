// ligaperuana.js
//
// Módulo con la lógica completa del torneo Liga1 Te Apuesto 2025
// Incluye formato, reglas de puntuación, clasificación, playoffs y descensos
// No incluye fixtures; estos se definiran en archivos separados.
//

const ligaPeruana = {
  nombre: "Liga1 Te Apuesto 2025",
  nombreComercial: "Liga1 2025",
  patrocinador: "Te Apuesto",
  equipos: 19,

  // Fechas oficiales para Apertura y Clausura
  fechas: {
    apertura: {
      inicio: "2025-01-28",  // Último fin de semana de enero
      fin: "2025-06-13"      // Una semana antes del inicio Copa América
    },
    clausura: {
      inicio: "2025-07-15",  // Tras la final de Copa América
      fin: "2025-11-30"
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
      return {
        tipo: "finalDirecta",
        finalistas: [campeonApertura, campeonClausura],
        descripcion: "Final directa: campeones de Apertura y Clausura, primeros dos en acumulada",
        partidos: [
          { local: campeonApertura, visitante: campeonClausura, partido: "ida" },
          { local: campeonClausura, visitante: campeonApertura, partido: "vuelta" }
        ]
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

    return {
      tipo: "playoffs",
      descripcion: "Playoffs con semifinales y final ida y vuelta",
      semifinales: [
        { local: participantes[0], visitante: participantes[3], idaVuelta: true },
        { local: participantes[1], visitante: participantes[2], idaVuelta: true }
      ],
      final: null // Se definirá tras semifinales
    };
  }
};

export { ligaPeruana };
