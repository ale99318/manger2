// Este JS debe cargarse después de jugadores.js y clubesCompradores.js 
// Simulación simple de negociación para un jugador dado
function generarOfertasParaJugador(jugador) {
  const ofertas = [];
  clubesCompradores.forEach(club => {
    // El club solo ofertará si tiene suficiente presupuesto
    if (club.presupuesto >= jugador.valor) {
      // Probabilidad basada en reputación (simple)
      const probabilidad = Math.min(club.reputacion / 100, 0.9);
      if (Math.random() < probabilidad) {
        // Calcular la oferta deseada (entre 90% y 120% del valor)
        const factorOferta = 0.9 + Math.random() * 0.3;
        const ofertaDeseada = Math.floor(jugador.valor * factorOferta);
        // Limitar la oferta al presupuesto disponible
        const ofertaFinal = Math.min(ofertaDeseada, club.presupuesto);
        
        const oferta = {
          club: club.nombre,
          pais: club.pais,
          reputacion: club.reputacion,
          ofertaEconomica: ofertaFinal,
        };
        ofertas.push(oferta);
      }
    }
  });
  return ofertas;
}

// Ejemplo: mostrar ofertas para todos los jugadores
jugadores.forEach(jugador => {
  const ofertas = generarOfertasParaJugador(jugador);
  if (ofertas.length > 0) {
    console.log(`📩 Ofertas para ${jugador.nombre}:`);
    ofertas.forEach(oferta => {
      console.log(`➡️ ${oferta.club} (${oferta.pais}) ofrece $${oferta.ofertaEconomica.toLocaleString()}`);
    });
    console.log("------");
  } else {
    console.log(`❌ Sin ofertas para ${jugador.nombre} por ahora.`);
  }
});
