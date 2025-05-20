// Función para mostrar información de debug
function mostrarDebug(mensaje) {
  const debugDiv = document.getElementById("debug-info"); 
  debugDiv.style.display = "block";
  debugDiv.innerHTML += `<p>${mensaje}</p>`;
}

// Función para generar ofertas para un jugador
function generarOfertasParaJugador(jugador) {
  const ofertas = [];
  
  // Verificamos que clubesCompradores esté definido
  if (!window.clubesCompradores) {
    mostrarDebug("❌ Error: No se encontró la variable 'clubesCompradores'");
    return [];
  }
  
  clubesCompradores.forEach(club => {
    // El club solo ofertará si tiene suficiente presupuesto
    if (club.presupuesto >= jugador.valor) {
      // Probabilidad basada en reputación (simple)
      const probabilidad = Math.min(club.reputacion / 100, 0.9);
      if (Math.random() < probabilidad) {
        // Calculamos un factor de oferta entre 0.9 y 1.2
        const factorOferta = 0.9 + Math.random() * 0.3;
        // Calculamos la oferta deseada
        const ofertaDeseada = Math.floor(jugador.valor * factorOferta);
        // Limitamos la oferta al presupuesto disponible
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

// Función para mostrar las ofertas en el DOM
function mostrarOfertas() {
  const contenedor = document.getElementById("contenedor-ofertas");
  
  // Verificar que los datos estén cargados
  if (!window.jugadores) {
    mostrarDebug("❌ Error: No se encontró la variable 'jugadores'");
    return;
  }
  
  // Limpiar contenedor
  contenedor.innerHTML = "";
  
  // Mostrar ofertas para cada jugador
  jugadores.forEach(jugador => {
    const ofertas = generarOfertasParaJugador(jugador);
    
    // Crear elemento para el jugador
    const jugadorDiv = document.createElement("div");
    jugadorDiv.classList.add("jugador-oferta");
    
    // Agregar información del jugador
    jugadorDiv.innerHTML = `<h3>${jugador.nombre} (${jugador.club}) - ${jugador.posicion}</h3>`;
    
    // Agregar ofertas o mensaje si no hay ofertas
    if (ofertas.length > 0) {
      const lista = document.createElement("ul");
      ofertas.forEach(oferta => {
        const item = document.createElement("li");
        item.textContent = `${oferta.club} (${oferta.pais}) ofrece $${oferta.ofertaEconomica.toLocaleString()}`;
        lista.appendChild(item);
      });
      jugadorDiv.appendChild(lista);
    } else {
      const noOfertas = document.createElement("p");
      noOfertas.textContent = "Sin ofertas disponibles por ahora.";
      jugadorDiv.appendChild(noOfertas);
    }
    
    // Agregar al contenedor principal
    contenedor.appendChild(jugadorDiv);
  });
}

// Ejecutar cuando se cargue la página
window.addEventListener("DOMContentLoaded", function() {
  try {
    mostrarOfertas();
  } catch (error) {
    mostrarDebug(`❌ Error: ${error.message}`);
  }
});
