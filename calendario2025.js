const calendario2025 = [];

const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 2025 no es bisiesto

for (let mes = 0; mes < 12; mes++) {
  for (let dia = 1; dia <= diasPorMes[mes]; dia++) {
    const fecha = new Date(2025, mes, dia);
    const fechaISO = fecha.toISOString().split("T")[0]; // formato YYYY-MM-DD

    calendario2025.push({
      fecha: fechaISO,
      dia,
      mes: mes + 1, // Para que enero sea 1 y diciembre 12
      eventos: []
    });
  }
}

// Exportar si usas módulos ES6
// export default calendario2025;

// Si estás en entorno común (Node o navegador sin módulos):
window.calendario2025 = calendario2025;
