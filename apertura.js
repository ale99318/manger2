// AperturaGenerator.js

function generarFixtureApertura(clubes) {
  const fechas = [];
  const totalFechas = clubes.length - 1; // 18 fechas si hay 19 clubes
  const equipos = [...clubes];
  const librePorFecha = [];

  // Algoritmo Round-Robin modificado para número impar
  if (equipos.length % 2 !== 0) {
    equipos.push({ id: "libre", nombre: "LIBRE" }); // agregar equipo ficticio
  }

  const totalEquipos = equipos.length;
  const mitad = totalEquipos / 2;

  // Fecha inicial
  let fechaBase = new Date("2025-02-01");

  for (let r = 0; r < totalFechas; r++) {
    const partidos = [];
    for (let i = 0; i < mitad; i++) {
      const equipoA = equipos[i];
      const equipoB = equipos[totalEquipos - 1 - i];

      // Evitar partido con equipo ficticio
      if (equipoA.id === "libre") {
        librePorFecha.push(equipoB.nombre);
        continue;
      }
      if (equipoB.id === "libre") {
        librePorFecha.push(equipoA.nombre);
        continue;
      }

      // Local y visitante alternado por fecha
      const local = (r + i) % 2 === 0 ? equipoA : equipoB;
      const visitante = local === equipoA ? equipoB : equipoA;

      partidos.push({
        local: local.nombre,
        visitante: visitante.nombre,
        estadio: local.estadio,
        ciudad: local.ciudad,
        escudoLocal: local.escudoUrl,
        escudoVisitante: visitante.escudoUrl,
        estadioUrl: local.estadioUrl,
        esClasico: local.clasico === visitante.id || visitante.clasico === local.id,
        fechaPartido: formatoFecha(new Date(fechaBase.getTime() + r * 7 * 24 * 60 * 60 * 1000)), // cada 7 días
        hora: "15:30",
      });
    }

    fechas.push({
      fecha: r + 1,
      partidos,
      libre: librePorFecha[r] || null,
    });
  }

  return fechas;
}

function formatoFecha(date) {
  return date.toISOString().split("T")[0]; // "2025-02-01"
}
