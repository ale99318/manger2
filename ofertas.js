// Obtener el jugador que está en venta
const jugadorNombre = localStorage.getItem("jugadorEnTransferencia");

// Recuperar lista completa de jugadores
const jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");

// Buscar al jugador
const jugador = jugadores.find(j => j.nombre === jugadorNombre);

// Validar jugador
if (!jugadorNombre) {
  document.body.innerHTML = "<p>No hay jugador seleccionado.</p>";
} else if (!jugador) {
  document.body.innerHTML = "<p>Jugador no encontrado.</p>";
} else {
  // Mostrar nombre del jugador
  const jugadorInfo = document.getElementById("jugador-info");
  jugadorInfo.textContent = `Jugador: ${jugador.nombre} - Valor estimado: $${jugador.valor.toLocaleString()}`;

  // Obtener contenedor
  const listaOfertas = document.getElementById("lista-ofertas");

  // Generar ofertas aleatorias desde clubesCompradores
  const ofertas = clubesCompradores.map(club => ({
    club: club.nombre,
    pais: club.pais,
    reputacion: club.reputacion,
    oferta: Math.floor(jugador.valor * (0.8 + Math.random() * 0.6))
  }));

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
}
