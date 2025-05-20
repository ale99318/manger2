// Obtener el jugador en transferencia del localStorage
const jugadorEnTransferencia = localStorage.getItem("jugadorEnTransferencia");

// Función para generar ofertas usando los clubesCompradores existentes
function generarOfertasTransferencias() {
  const ofertas = [];
  // Buscar el jugador en venta por su nombre
  const jugadorDisponible = jugadores.find(j => j.nombre === jugadorEnTransferencia);
  
  if (jugadorDisponible) {
    // Filtrar clubes que puedan pagar el valor del jugador
    const clubesConDinero = clubesCompradores.filter(club => club.presupuesto >= jugadorDisponible.valor * 0.6);
    if (clubesConDinero.length > 0) {
      // Crear varias ofertas (entre 2 y 5)
      const cantidadOfertas = Math.floor(Math.random() * 4) + 2;
      
      for (let i = 0; i < cantidadOfertas && i < clubesConDinero.length; i++) {
        // Elegir un club al azar que pueda pagar
        const clubInteresado = clubesConDinero[Math.floor(Math.random() * clubesConDinero.length)];
        
        // Determinar tipo de oferta aleatoriamente
        const tiposDeOferta = ["venta", "cesion", "cesion_opcion", "cesion_obligacion", "rescision"];
        const tipoOferta = tiposDeOferta[Math.floor(Math.random() * tiposDeOferta.length)];
        
        let montoOferta = 0;
        let detalles = {};
        
        switch(tipoOferta) {
          case "venta":
            // Venta definitiva: entre 80% y 130% del valor
            montoOferta = Math.floor(jugadorDisponible.valor * (0.8 + Math.random() * 0.5));
            detalles = {
              tipoTransferencia: "Venta definitiva",
              descripcion: "Transferencia permanente"
            };
            break;
            
          case "cesion":
            // Cesión simple: entre 10% y 25% del valor
            montoOferta = Math.floor(jugadorDisponible.valor * (0.1 + Math.random() * 0.15));
            detalles = {
              tipoTransferencia: "Cesión temporal",
              duracion: Math.random() > 0.5 ? "6 meses" : "12 meses",
              porcentajeSalario: Math.floor(Math.random() * 100) + "%",
              descripcion: "Préstamo sin opción de compra"
            };
            break;
            
          case "cesion_opcion":
            // Cesión con opción de compra: préstamo más opción
            montoOferta = Math.floor(jugadorDisponible.valor * (0.1 + Math.random() * 0.15));
            const opcionCompra = Math.floor(jugadorDisponible.valor * (0.9 + Math.random() * 0.4));
            detalles = {
              tipoTransferencia: "Cesión con opción de compra",
              duracion: Math.random() > 0.5 ? "6 meses" : "12 meses",
              porcentajeSalario: Math.floor(Math.random() * 100) + "%",
              opcionCompra: opcionCompra,
              descripcion: `Préstamo con opción de compra de $${opcionCompra.toLocaleString()}`
            };
            break;
            
          case "cesion_obligacion":
            // Cesión con obligación de compra
            montoOferta = Math.floor(jugadorDisponible.valor * (0.15 + Math.random() * 0.2));
            const obligacionCompra = Math.floor(jugadorDisponible.valor * (0.8 + Math.random() * 0.3));
            detalles = {
              tipoTransferencia: "Cesión con obligación de compra",
              duracion: Math.random() > 0.5 ? "6 meses" : "12 meses",
              porcentajeSalario: Math.floor(Math.random() * 100) + "%",
              obligacionCompra: obligacionCompra,
              descripcion: `Préstamo con obligación de compra de $${obligacionCompra.toLocaleString()}`
            };
            break;
            
          case "rescision":
            // Rescisión de contrato (valor más bajo)
            montoOferta = Math.floor(jugadorDisponible.valor * (0.5 + Math.random() * 0.3));
            detalles = {
              tipoTransferencia: "Rescisión de contrato",
              descripcion: "Terminación de contrato con indemnización"
            };
            break;
        }
        
        // Añadir recompra en ventas definitivas (con baja probabilidad)
        if (tipoOferta === "venta" && Math.random() < 0.3) {
          const valorRecompra = Math.floor(montoOferta * (1.3 + Math.random()));
          detalles.clausulaRecompra = valorRecompra;
          detalles.descripcion += ` con opción de recompra por $${valorRecompra.toLocaleString()}`;
        }
        
        ofertas.push({
          jugador: jugadorDisponible.nombre,
          edad: jugadorDisponible.edad,
          posicion: jugadorDisponible.posicion,
          valor: jugadorDisponible.valor,
          clubInteresado: clubInteresado.nombre,
          pais: clubInteresado.pais,
          oferta: montoOferta,
          tipoOferta: tipoOferta,
          detalles: detalles
        });
      }
    }
  }
  
  return ofertas;
}

// Mostrar ofertas en el div existente en tu HTML
function mostrarOfertas() {
  const ofertas = generarOfertasTransferencias();
  
  // Obtener el div donde se mostrarán las ofertas
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
      ofertaDiv.style.marginBottom = "20px";
      
      const pTitulo = document.createElement("p");
      pTitulo.innerHTML = `<strong>${oferta.detalles.tipoTransferencia}</strong>: ${oferta.clubInteresado} (${oferta.pais})`;
      ofertaDiv.appendChild(pTitulo);
      
      const pJugador = document.createElement("p");
      pJugador.textContent = `Jugador: ${oferta.jugador} (${oferta.posicion}, ${oferta.edad} años)`;
      ofertaDiv.appendChild(pJugador);
      
      const pOferta = document.createElement("p");
      pOferta.textContent = `Monto: $${oferta.oferta.toLocaleString()}`;
      ofertaDiv.appendChild(pOferta);
      
      const pDetalles = document.createElement("p");
      pDetalles.textContent = `Detalles: ${oferta.detalles.descripcion}`;
      ofertaDiv.appendChild(pDetalles);
      
      // Añadir detalles adicionales según el tipo de oferta
      if (oferta.tipoOferta.includes("cesion")) {
        const pDuracion = document.createElement("p");
        pDuracion.textContent = `Duración: ${oferta.detalles.duracion}`;
        ofertaDiv.appendChild(pDuracion);
        
        const pSalario = document.createElement("p");
        pSalario.textContent = `El club pagará el ${oferta.detalles.porcentajeSalario} del salario`;
        ofertaDiv.appendChild(pSalario);
      }
      
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
    botonVolver.style.marginTop = "20px";
    div.appendChild(botonVolver);
  }
}

// Función para aceptar una oferta
function aceptarOferta(oferta) {
  // Obtener jugadores vendidos actuales
  let jugadoresVendidos = JSON.parse(localStorage.getItem("jugadoresVendidos") || "[]");
  
  // Guardar información detallada de la transferencia
  let historialTransferencias = JSON.parse(localStorage.getItem("historialTransferencias") || "[]");
  historialTransferencias.push({
    jugador: oferta.jugador,
    desde: localStorage.getItem("selectedClub"),
    hacia: oferta.clubInteresado,
    monto: oferta.oferta,
    tipo: oferta.detalles.tipoTransferencia,
    detalles: oferta.detalles,
    fecha: new Date().toLocaleDateString()
  });
  localStorage.setItem("historialTransferencias", JSON.stringify(historialTransferencias));
  
  // Si es cesión temporal sin obligación de compra, no eliminamos permanentemente al jugador
  if (oferta.tipoOferta === "cesion") {
    // Marcar al jugador como cedido pero no eliminarlo completamente
    let jugadoresCedidos = JSON.parse(localStorage.getItem("jugadoresCedidos") || "[]");
    jugadoresCedidos.push({
      nombre: oferta.jugador,
      club: oferta.clubInteresado,
      finPrestamo: oferta.detalles.duracion === "6 meses" ? 
        new Date(new Date().setMonth(new Date().getMonth() + 6)).toLocaleDateString() : 
        new Date(new Date().setMonth(new Date().getMonth() + 12)).toLocaleDateString()
    });
    localStorage.setItem("jugadoresCedidos", JSON.stringify(jugadoresCedidos));
    
    alert(`¡Cesión completada! ${oferta.jugador} ha sido cedido al ${oferta.clubInteresado} por ${oferta.detalles.duracion}.`);
  } else {
    // En otros casos, añadir el jugador a la lista de vendidos permanentemente
    jugadoresVendidos.push(oferta.jugador);
    localStorage.setItem("jugadoresVendidos", JSON.stringify(jugadoresVendidos));
    
    alert(`¡Oferta aceptada! Has transferido a ${oferta.jugador} al ${oferta.clubInteresado} por $${oferta.oferta.toLocaleString()} (${oferta.detalles.tipoTransferencia}).`);
  }
  
  // Redirigir de vuelta a la plantilla
  window.location.href = "plantilla.html";
}

// Función para rechazar una oferta
function rechazarOferta(oferta) {
  // Simplemente eliminar esa oferta de la vista
  const ofertaElement = event.target.parentNode;
  ofertaElement.remove();
  
  // Si ya no quedan ofertas, mostrar mensaje
  if (document.querySelectorAll("#lista-ofertas > div").length === 0) {
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
