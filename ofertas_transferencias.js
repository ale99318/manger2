// Obtener el jugador en transferencia del localStorage
const jugadorEnTransferencia = localStorage.getItem("jugadorEnTransferencia");

// Suponiendo que tienes acceso a jugadores[] y clubesCompradores[]
function generarOfertasTransferencias() {
  const ofertas = [];
  // Buscar el jugador en venta por su nombre
  const jugadorDisponible = jugadores.find(j => j.nombre === jugadorEnTransferencia);
  
  if (jugadorDisponible) {
    // Filtrar clubes que puedan pagar el valor del jugador
    const clubesConDinero = clubesCompradores.filter(club => club.presupuesto >= jugadorDisponible.valor);
    if (clubesConDinero.length > 0) {
      // Crear varias ofertas (entre 1 y 3)
      const cantidadOfertas = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < cantidadOfertas && i < clubesConDinero.length; i++) {
        // Elegir un club al azar que pueda pagar
        const clubInteresado = clubesConDinero[Math.floor(Math.random() * clubesConDinero.length)];
        const montoOferta = Math.floor(jugadorDisponible.valor * (1 + Math.random() * 0.3)); // Hasta 30% más
        
        ofertas.push({
          jugador: jugadorDisponible.nombre,
          edad: jugadorDisponible.edad,
          posicion: jugadorDisponible.posicion,
          valor: jugadorDisponible.valor,
          clubInteresado: clubInteresado.nombre,
          pais: clubInteresado.pais,
          oferta: montoOferta
        });
      }
    }
  }
  
  return ofertas;
}

// Mostrar ofertas en HTML
function mostrarOfertas() {
  const ofertas = generarOfertasTransferencias();
  
  // Si deseas mostrarlas en HTML:
  const div = document.getElementById("lista-ofertas");
  if (div) {
    div.innerHTML = "";
    
    if (ofertas.length === 0) {
      const p = document.createElement("p");
      p.textContent = "No hay ofertas para este jugador actualmente.";
      div.appendChild(p);
      
      // Añadir botón para volver
      const botonVolver = document.createElement("button");
      botonVolver.textContent = "Volver a la plantilla";
      botonVolver.onclick = function() {
        window.location.href = "plantilla.html";
      };
      div.appendChild(botonVolver);
      
      return;
    }
    
    ofertas.forEach(oferta => {
      const ofertaDiv = document.createElement("div");
      ofertaDiv.className = "oferta";
      
      const p = document.createElement("p");
      p.textContent = `${oferta.clubInteresado} (${oferta.pais}) ofrece $${oferta.oferta.toLocaleString()} por ${oferta.jugador} (${oferta.posicion}, ${oferta.edad} años)`;
      ofertaDiv.appendChild(p);
      
      // Añadir botones para aceptar o rechazar la oferta
      const botonAceptar = document.createElement("button");
      botonAceptar.textContent = "Aceptar oferta";
      botonAceptar.onclick = function() {
        aceptarOferta(oferta);
      };
      ofertaDiv.appendChild(botonAceptar);
      
      const botonRechazar = document.createElement("button");
      botonRechazar.textContent = "Rechazar oferta";
      botonRechazar.onclick = function() {
        rechazarOferta(oferta);
      };
      ofertaDiv.appendChild(botonRechazar);
      
      div.appendChild(ofertaDiv);
    });
    
    // Añadir botón para volver sin aceptar ninguna oferta
    const botonVolver = document.createElement("button");
    botonVolver.textContent = "Volver sin vender";
    botonVolver.onclick = function() {
      window.location.href = "plantilla.html";
    };
    div.appendChild(botonVolver);
  }
}

// Función para aceptar una oferta
function aceptarOferta(oferta) {
  // Obtener jugadores vendidos actuales
  let jugadoresVendidos = JSON.parse(localStorage.getItem("jugadoresVendidos") || "[]");
  
  // Añadir el jugador a la lista de vendidos
  jugadoresVendidos.push(oferta.jugador);
  
  // Guardar en localStorage
  localStorage.setItem("jugadoresVendidos", JSON.stringify(jugadoresVendidos));
  
  // Mostrar mensaje de confirmación
  alert(`¡Oferta aceptada! Has vendido a ${oferta.jugador} al ${oferta.clubInteresado} por $${oferta.oferta.toLocaleString()}`);
  
  // Redirigir de vuelta a la plantilla
  window.location.href = "plantilla.html";
}

// Función para rechazar una oferta
function rechazarOferta(oferta) {
  // Simplemente eliminar esa oferta de la vista
  const ofertaElement = event.target.parentNode;
  ofertaElement.remove();
  
  // Si ya no quedan ofertas, mostrar mensaje
  if (document.querySelectorAll(".oferta").length === 0) {
    const div = document.getElementById("lista-ofertas");
    const p = document.createElement("p");
    p.textContent = "No hay más ofertas disponibles.";
    div.appendChild(p);
    
    const botonVolver = document.createElement("button");
    botonVolver.textContent = "Volver a la plantilla";
    botonVolver.onclick = function() {
      window.location.href = "plantilla.html";
    };
    div.appendChild(botonVolver);
  }
}

// Ejecutar la función cuando la página esté lista
window.addEventListener("DOMContentLoaded", () => {
  mostrarOfertas();
});
