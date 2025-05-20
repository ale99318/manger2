// Suponiendo que tienes acceso a jugadores[] y clubesCompradores[]

function generarOfertasTransferencias(jugadoresDisponibles) {
  const ofertas = [];

  jugadoresDisponibles.forEach(jugador => {
    // Filtrar clubes que puedan pagar el valor del jugador
    const clubesConDinero = clubesCompradores.filter(club => club.presupuesto >= jugador.valor);

    if (clubesConDinero.length > 0) {
      // Elegir un club al azar que pueda pagar
      const clubInteresado = clubesConDinero[Math.floor(Math.random() * clubesConDinero.length)];

      const montoOferta = Math.floor(jugador.valor * (1 + Math.random() * 0.3)); // Hasta 30% más

      ofertas.push({
        jugador: jugador.nombre,
        edad: jugador.edad,
        posicion: jugador.posicion,
        valor: jugador.valor,
        clubInteresado: clubInteresado.nombre,
        pais: clubInteresado.pais,
        oferta: montoOferta
      });
    }
  });

  return ofertas;
}

// Mostrar ofertas en consola o en HTML
function mostrarOfertas() {
  const jugadoresEnVenta = jugadores.filter(j => j.estado === "transferible" || j.enVenta); // Asegúrate de marcar jugadores transferibles
  const ofertas = generarOfertasTransferencias(jugadoresEnVenta);

  ofertas.forEach(oferta => {
    console.log(
      `${oferta.clubInteresado} (${oferta.pais}) ofrece $${oferta.oferta.toLocaleString()} por ${oferta.jugador} (${oferta.posicion}, ${oferta.edad} años)`
    );
  });

  // Si deseas mostrarlas en HTML:
  const div = document.getElementById("lista-ofertas");
  if (div) {
    div.innerHTML = "";
    ofertas.forEach(oferta => {
      const p = document.createElement("p");
      p.textContent = `${oferta.clubInteresado} (${oferta.pais}) ofrece $${oferta.oferta.toLocaleString()} por ${oferta.jugador}`;
      div.appendChild(p);
    });
  }
}

// Ejecutar la función cuando la página esté lista
window.addEventListener("DOMContentLoaded", () => {
  mostrarOfertas();
});
