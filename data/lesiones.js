const lesiones = [
  {
    nombre: "Golpe leve",
    gravedad: "leve",
    diasRecuperacion: 1,
    descripcion: "Molestia menor, puede entrenar con cuidado.",
    probabilidad: 0.2
  },
  {
    nombre: "Calambre",
    gravedad: "leve",
    diasRecuperacion: 2,
    descripcion: "Fatiga muscular, necesita descanso.",
    probabilidad: 0.18
  },
  {
    nombre: "Esguince leve",
    gravedad: "moderada",
    diasRecuperacion: 5,
    descripcion: "Ligamento afectado, requiere reposo corto.",
    probabilidad: 0.15
  },
  {
    nombre: "Contusión muscular",
    gravedad: "moderada",
    diasRecuperacion: 7,
    descripcion: "Golpe fuerte en un músculo.",
    probabilidad: 0.12
  },
  {
    nombre: "Tendinitis",
    gravedad: "moderada",
    diasRecuperacion: 10,
    descripcion: "Inflamación de tendones por sobreuso.",
    probabilidad: 0.1
  },
  {
    nombre: "Desgarro muscular",
    gravedad: "grave",
    diasRecuperacion: 20,
    descripcion: "Rotura parcial de fibras musculares.",
    probabilidad: 0.08
  },
  {
    nombre: "Esguince grave",
    gravedad: "grave",
    diasRecuperacion: 25,
    descripcion: "Lesión seria en ligamentos, sin cirugía.",
    probabilidad: 0.06
  },
  {
    nombre: "Rotura de ligamentos (LCA)",
    gravedad: "crítica",
    diasRecuperacion: 90,
    descripcion: "Rotura del ligamento cruzado anterior. Requiere cirugía.",
    probabilidad: 0.03
  },
  {
    nombre: "Fractura ósea",
    gravedad: "crítica",
    diasRecuperacion: 120,
    descripcion: "Hueso roto, necesita inmovilización y rehabilitación.",
    probabilidad: 0.02
  },
  {
    nombre: "Lesión cerebral traumática",
    gravedad: "crítica",
    diasRecuperacion: 180,
    descripcion: "Golpe severo en la cabeza. Puede dejar secuelas.",
    probabilidad: 0.01
  },
  {
    nombre: "Colapso pulmonar en cancha",
    gravedad: "mortal",
    diasRecuperacion: -1,
    descripcion: "Situación crítica, el jugador fallece o se retira permanentemente.",
    probabilidad: 0.001
  }
];
