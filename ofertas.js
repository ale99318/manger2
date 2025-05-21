// Obtener el jugador que está en venta
const jugadorNombre = localStorage.getItem("jugadorEnTransferencia");

// Simular datos de jugadores (si no vienen de otro archivo, debes importar el array original)
const jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];

const jugador = jugadores.find(j => j.nombre === jugadorNombre);

// Mostrar nombre del jugador
const jugadorInfo = document.getElementById("jugador-info");
jugadorInfo.textContent = jugador ? `Jugador: ${jugador.nombre} - Valor estimado: $${jugador.valor.toLocaleString()}` : "Jugador no encontrado";

// Obtener contenedor
const listaOfertas = document.getElementById("lista-ofertas");

// Generar ofertas aleatorias desde clubesCompradores
const ofertas = clubesCompradores.map(club => {
  const oferta = {
    club: club.nombre,
    pais: club.pais,
    reputacion: club.reputacion,
    oferta: Math.floor(jugador.valor * (0.8 + Math.random() * 0.6)) // 80% a 140% del valor
  };
  return oferta;
});

// Ordenar por mejor oferta
ofertas.sort((a, b) => b.oferta - a.oferta);

// Mostrar en la interfaz
ofertas.forEach(oferta => {
  const div = document.createElement("div");
  div.classList.add("oferta");
  
  div.innerHTML = `
    <h3>${oferta.club} (${oferta.pais})</h3>
    <p>Reputación: ${oferta.reputacion}</p>
    <p>Oferta: $${oferta.oferta.toLocaleString()}</p>
    <button onclick="aceptarOferta('${oferta.club}', ${oferta.oferta})">Aceptar Oferta</button>
  `;
  
  listaOfertas.appendChild(div);
});

function aceptarOferta(clubComprador, monto) {
  alert(`Oferta aceptada de ${clubComprador} por $${monto.toLocaleString()}`);

  // Guardar en historial de transferencias
  const historial = JSON.parse(localStorage.getItem("historialTransferencias") || "[]");
  historial.push({
    jugador: jugador.nombre,
    vendidoA: clubComprador,
    monto: monto,
    fecha: new Date().toLocaleDateString()
  });
  localStorage.setItem("historialTransferencias", JSON.stringify(historial));

  // Marcar como vendido
  let vendidos = JSON.parse(localStorage.getItem("jugadoresVendidos") || "[]");
  vendidos.push(jugador.nombre);
  localStorage.setItem("jugadoresVendidos", JSON.stringify(vendidos));

  // Redirigir de nuevo al club
  window.location.href = "club.html";
}

function volver() {
  window.location.href = "club.html";
}
