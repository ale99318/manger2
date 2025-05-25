// Fecha inicial
let fecha = new Date(2025, 0, 1); // 01/01/2025

// Rango máximo: 31/12/2040
const fechaFin = new Date(2040, 11, 31);

// Referencias DOM
const fechaActual = document.getElementById("fechaActual");
const listaEventos = document.getElementById("listaEventos");

// Mostrar fecha actual en formato dd/mm/yyyy
function actualizarFecha() {
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  fechaActual.textContent = `${dia}/${mes}/${anio}`;
  notificarFecha(); // función para avisar a otros scripts
}
actualizarFecha(); // Mostrar al cargar

// Botones
document.getElementById("pasarDia").addEventListener("click", () => {
  if (fecha < fechaFin) {
    fecha.setDate(fecha.getDate() + 1);
    actualizarFecha();
  }
});

document.getElementById("pasarMes").addEventListener("click", () => {
  if (fecha < fechaFin) {
    fecha.setMonth(fecha.getMonth() + 1);
    actualizarFecha();
  }
});

document.getElementById("pasarAnio").addEventListener("click", () => {
  if (fecha < fechaFin) {
    fecha.setFullYear(fecha.getFullYear() + 1);
    actualizarFecha();
  }
});

// 🔔 Esta es la función principal para que otros HTML o JS puedan saber la fecha actual
// Se puede invocar desde otros scripts como: `window.getFechaJuego()`
window.getFechaJuego = function () {
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  return `${dia}/${mes}/${anio}`;
};

// 📩 Esta función permite recibir eventos desde otros JS
// Puedes llamarla desde otro archivo JS como: window.agregarEvento("Nombre del evento")
window.agregarEvento = function (nombreEvento) {
  const nuevo = document.createElement("div");
  nuevo.textContent = `${getFechaJuego()} - ${nombreEvento}`;
  listaEventos.appendChild(nuevo);
};
