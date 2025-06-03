// funciones.js

// Lista de eventos que generan cansancio en los jugadores
const eventosCansancio = [
  {
    tipo: "Partido completo",
    descripcion: "Jugar los 90 minutos genera un alto desgaste físico",
    impactoEnergia: -30,
    impactoResistencia: -10
  },
  {
    tipo: "Entrenamiento intenso",
    descripcion: "Sesión de entrenamiento con alta carga física",
    impactoEnergia: -20,
    impactoResistencia: -5
  },
  {
    tipo: "Viaje largo",
    descripcion: "Desplazamiento de más de 5 horas para un partido de visita",
    impactoEnergia: -10,
    impactoResistencia: 0
  },
  {
    tipo: "Sustitución tardía",
    descripcion: "Entrar en el segundo tiempo y jugar 30 minutos",
    impactoEnergia: -15,
    impactoResistencia: -3
  },
  {
    tipo: "Condiciones climáticas extremas",
    descripcion: "Partido bajo lluvia intensa o calor excesivo",
    impactoEnergia: -8,
    impactoResistencia: -2
  },
  {
    tipo: "Entrenamiento leve",
    descripcion: "Sesión de entrenamiento con carga física moderada",
    impactoEnergia: -10,
    impactoResistencia: -2
  },
  {
    tipo: "Falta de descanso",
    descripcion: "Menos de 2 días de descanso entre partidos",
    impactoEnergia: -25,
    impactoResistencia: -7
  },
  {
    tipo: "Fiesta nocturna",
    descripcion: "El jugador asistió a una fiesta hasta altas horas de la noche",
    impactoEnergia: -20,
    impactoResistencia: -5
  },
  {
    tipo: "Desvelada por cumpleaños",
    descripcion: "Celebración de cumpleaños con poco descanso",
    impactoEnergia: -15,
    impactoResistencia: -4
  },
  {
    tipo: "Ampay en televisión",
    descripcion: "Fue captado en una salida comprometedora",
    impactoEnergia: -10,
    impactoResistencia: -3
  },
  {
    tipo: "Salida con personas ajenas a su pareja",
    descripcion: "Problemas personales afectan su estado físico",
    impactoEnergia: -12,
    impactoResistencia: -4
  },
  {
    tipo: "Dormir menos de 6 horas seguidas",
    descripcion: "El jugador no tuvo un descanso adecuado durante la noche",
    impactoEnergia: -18,
    impactoResistencia: -5
  },
  {
    tipo: "Comer comida chatarra o mala nutrición",
    descripcion: "Mala alimentación afecta el rendimiento físico",
    impactoEnergia: -15,
    impactoResistencia: -4
  },
  {
    tipo: "Abuso de bebidas energéticas o alcohol",
    descripcion: "Consumo excesivo de sustancias que alteran el estado físico",
    impactoEnergia: -20,
    impactoResistencia: -6
  },
  {
    tipo: "Uso excesivo de videojuegos hasta tarde",
    descripcion: "Falta de sueño por jugar videojuegos hasta altas horas",
    impactoEnergia: -14,
    impactoResistencia: -3
  },
  {
    tipo: "Discoteca sin descanso posterior",
    descripcion: "Salidas nocturnas sin reposo afectan el rendimiento",
    impactoEnergia: -22,
    impactoResistencia: -6
  },
  {
    tipo: "Viajes personales sin avisar al club",
    descripcion: "Viajes fuera de control que afectan la rutina del jugador",
    impactoEnergia: -16,
    impactoResistencia: -4
  },
  {
    tipo: "Entrevistas conflictivas con la prensa",
    descripcion: "Problemas mediáticos generan desgaste emocional y físico",
    impactoEnergia: -12,
    impactoResistencia: -3
  },
  {
    tipo: "Dolor muscular sin tratamiento",
    descripcion: "El jugador no se recupera adecuadamente de molestias físicas",
    impactoEnergia: -10,
    impactoResistencia: -5
  },
  {
    tipo: "No acudir a sesiones de fisioterapia",
    descripcion: "Ignorar sesiones de recuperación compromete el estado físico",
    impactoEnergia: -12,
    impactoResistencia: -4
  },
  {
    tipo: "Entrenamiento con molestias físicas",
    descripcion: "Esforzarse con dolores causa más daño físico",
    impactoEnergia: -14,
    impactoResistencia: -6
  }
];


// Exportar si se usa con módulos
// export { eventosCansancio, aplicarCansancio };
