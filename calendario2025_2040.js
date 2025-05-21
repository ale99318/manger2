const calendario2025_2040 = [];

function generarCalendario(desdeAño, hastaAño) {
  const calendario = [];

  for (let año = desdeAño; año <= hastaAño; año++) {
    for (let mes = 0; mes < 12; mes++) {
      const diasEnMes = new Date(año, mes + 1, 0).getDate(); // Último día del mes
      for (let dia = 1; dia <= diasEnMes; dia++) {
        const fecha = new Date(año, mes, dia);
        const fechaISO = fecha.toISOString().split("T")[0];

        calendario.push({
          fecha: fechaISO,
          año,
          mes: mes + 1,
          dia,
          eventos: []
        });
      }
    }
  }

  return calendario;
}

// Generar calendario desde 2025 hasta 2040
const calendario = generarCalendario(2025, 2040);

// Puedes exportarlo o asignarlo al window si estás en el navegador
// export default calendario;
// window.calendario2025_2040 = calendario;
