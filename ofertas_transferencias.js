// Obtener el jugador en transferencia del localStorage
const jugadorEnTransferencia = localStorage.getItem("jugadorEnTransferencia");

// Función para generar ofertas usando los clubesCompradores existentes
function generarOfertasTransferencias() {
  const ofertas = [];
  // Buscar el jugador en venta por su nombre
  const jugadorDisponible = jugadores.find(j => j.nombre === jugadorEnTransferencia);
  
  if (!jugadorDisponible) return [];
  
  // Aplicar reglas de negocio para determinar qué tipos de ofertas son posibles
  const tiposDeOfertaPosibles = determinarTiposOfertaDisponibles(jugadorDisponible);
  
  // Si no hay tipos de oferta posibles, retornar array vacío
  if (tiposDeOfertaPosibles.length === 0) return [];
  
  // Filtrar clubes que puedan pagar el valor del jugador según su tipo
  const clubesInteresados = filtrarClubesInteresados(jugadorDisponible);
  
  if (clubesInteresados.length === 0) return [];
  
  // Limitar cantidad de ofertas (entre 1 y 3)
  const cantidadOfertas = Math.min(
    Math.floor(Math.random() * 3) + 1, 
    clubesInteresados.length
  );
  
  // Crear copia para poder eliminar clubes ya usados
  const clubesDisponibles = [...clubesInteresados];
  
  for (let i = 0; i < cantidadOfertas; i++) {
    // Elegir un club al azar que no haya sido usado
    const indexClub = Math.floor(Math.random() * clubesDisponibles.length);
    const clubInteresado = clubesDisponibles[indexClub];
    
    // Remover el club seleccionado para que no aparezca más de una vez
    clubesDisponibles.splice(indexClub, 1);
    
    // Elegir solo entre los tipos de oferta posibles para este jugador
    const tipoOferta = tiposDeOfertaPosibles[Math.floor(Math.random() * tiposDeOfertaPosibles.length)];
    
    // Generar la oferta según el tipo
    const oferta = generarOfertaSegunTipo(jugadorDisponible, clubInteresado, tipoOferta);
    
    ofertas.push(oferta);
  }
  
  return ofertas;
}

// Función para determinar qué tipos de oferta son posibles según el perfil del jugador
function determinarTiposOfertaDisponibles(jugador) {
  const tiposDisponibles = [];
  const edad = jugador.edad;
  const valor = jugador.valor;
  const lesionado = jugador.lesionado;
  const contrato = jugador.contrato; // meses restantes
  const titular = jugador.titular;
  const minutos = jugador.minutos_jugados;
  
  // 1. Venta definitiva
  if (!lesionado && edad < 34) {
    tiposDisponibles.push("venta");
  }
  
  // 2. Cesión (préstamo)
  if ((edad < 22 || minutos < 180) && !titular) {
    tiposDisponibles.push("cesion");
  }
  
  // 3. Cesión con opción de compra
  if (edad < 25 && !titular) {
    tiposDisponibles.push("cesion_opcion");
  }
  
  // 4. Cesión con obligación de compra
  if (edad < 28 && !lesionado && !titular) {
    tiposDisponibles.push("cesion_obligacion");
  }
  
  // 5. Rescisión de contrato
  if (contrato < 12 || jugador.felicidad < 50) {
    tiposDisponibles.push("rescision");
  }
  
  return tiposDisponibles;
}

// Función para filtrar clubes interesados según características del jugador
function filtrarClubesInteresados(jugador) {
  // Asumimos que clubesCompradores ya existe como una variable global
  return clubesCompradores.filter(club => {
    // Verificar presupuesto mínimo (al menos 60% del valor del jugador)
    const presupuestoSuficiente = club.presupuesto >= jugador.valor * 0.6;
    
    // Clubes grandes solo se interesan en jugadores con general alto o potencial alto
    if (club.nivel === "grande") {
      return presupuestoSuficiente && (jugador.general > 75 || jugador.potencial > 80);
    }
    
    // Clubes medianos pueden interesarse en jugadores con estadísticas decentes
    else if (club.nivel === "mediano") {
      return presupuestoSuficiente && (jugador.general > 65 || jugador.potencial > 75);
    }
    
    // Clubes pequeños se interesan en cualquier jugador que puedan permitirse
    else {
      return presupuestoSuficiente;
    }
  });
}

// Función para generar oferta según el tipo seleccionado
function generarOfertaSegunTipo(jugador, club, tipoOferta) {
  let montoOferta = 0;
  let detalles = {};
  
  switch(tipoOferta) {
    case "venta":
      // Venta definitiva: entre 80% y 130% del valor según prestigio del club
      const factorPrecio = club.nivel === "grande" ? 
                          (1.0 + Math.random() * 0.3) : // Clubes grandes pagan más
                          (0.8 + Math.random() * 0.2);  // Clubes más pequeños pagan menos
      
      montoOferta = Math.floor(jugador.valor * factorPrecio);
      detalles = {
        tipoTransferencia: "Venta definitiva",
        descripcion: "Transferencia permanente"
      };
      
      // Añadir recompra solo si el jugador es joven y con potencial
      if (jugador.edad < 25 && jugador.potencial > jugador.general + 5 && Math.random() < 0.3) {
        const valorRecompra = Math.floor(montoOferta * (1.3 + Math.random()));
        detalles.clausulaRecompra = valorRecompra;
        detalles.descripcion += ` con opción de recompra por $${valorRecompra.toLocaleString()}`;
      }
      break;
      
    case "cesion":
      // Cesión simple: entre 10% y 25% del valor
      montoOferta = Math.floor(jugador.valor * (0.1 + Math.random() * 0.15));
      
      // Calcular porcentaje de salario basado en nivel del club
      let porcentajeSalario;
      if (club.nivel === "grande") {
        porcentajeSalario = "100";
      } else if (club.nivel === "mediano") {
        porcentajeSalario = (Math.floor(Math.random() * 4) + 7) * 10; // Entre 70% y 100%
      } else {
        porcentajeSalario = (Math.floor(Math.random() * 5) + 5) * 10; // Entre 50% y 90%
      }
      
      detalles = {
        tipoTransferencia: "Cesión temporal",
        duracion: jugador.edad < 21 ? "12 meses" : (Math.random() > 0.5 ? "6 meses" : "12 meses"),
        porcentajeSalario: porcentajeSalario + "%",
        descripcion: "Préstamo sin opción de compra"
      };
      break;
      
    case "cesion_opcion":
      // Cesión con opción de compra: préstamo más opción
      montoOferta = Math.floor(jugador.valor * (0.1 + Math.random() * 0.15));
      
      // La opción de compra depende del potencial del jugador
      const factorPotencial = (jugador.potencial - jugador.general) / 10; // Factor basado en diferencia entre potencial y general
      const opcionCompra = Math.floor(jugador.valor * (1.0 + factorPotencial + Math.random() * 0.2));
      
      detalles = {
        tipoTransferencia: "Cesión con opción de compra",
        duracion: "12 meses", // Cesiones con opción suelen ser por temporada completa
        porcentajeSalario: club.nivel === "grande" ? "100%" : (Math.floor(Math.random() * 4) + 7) * 10 + "%",
        opcionCompra: opcionCompra,
        descripcion: `Préstamo con opción de compra de $${opcionCompra.toLocaleString()}`
      };
      break;
      
    case "cesion_obligacion":
      // Cesión con obligación de compra
      montoOferta = Math.floor(jugador.valor * (0.15 + Math.random() * 0.2));
      
      // La obligación suele ser un poco menor que el valor de mercado
      const obligacionCompra = Math.floor(jugador.valor * (0.8 + Math.random() * 0.1));
      
      detalles = {
        tipoTransferencia: "Cesión con obligación de compra",
        duracion: "12 meses", // Cesiones con obligación casi siempre por temporada completa
        porcentajeSalario: club.nivel === "grande" ? "100%" : (Math.floor(Math.random() * 3) + 8) * 10 + "%", // Entre 80% y 100%
        obligacionCompra: obligacionCompra,
        descripcion: `Préstamo con obligación de compra de $${obligacionCompra.toLocaleString()}`
      };
      break;
      
    case "rescision":
      // Rescisión de contrato (valor más bajo, depende de meses restantes de contrato)
      const factorRescision = jugador.contrato < 6 ? 0.4 : (jugador.contrato < 12 ? 0.6 : 0.8);
      montoOferta = Math.floor(jugador.valor * factorRescision);
      detalles = {
        tipoTransferencia: "Rescisión de contrato",
        descripcion: "Terminación de contrato con indemnización"
      };
      break;
  }
  
  return {
    jugador: jugador.nombre,
    edad: jugador.edad,
    posicion: jugador.posicion,
    valor: jugador.valor,
    clubInteresado: club.nombre,
    pais: club.pais,
    nivel: club.nivel,
    oferta: montoOferta,
    tipoOferta: tipoOferta,
    detalles: detalles
  };
}

// Mostrar ofertas en el div existente en tu HTML
function mostrarOfertas() {
  const ofertas = generarOfertasTransferencias();
  
  // Obtener el div donde se mostrarán las ofertas
  const div = document.getElementById("lista-ofertas");
  if (!div) return;
  
  div.innerHTML = "";
  
  if (ofertas.length === 0) {
    const divNoOfertas = document.createElement("div");
    divNoOfertas.className = "no-ofertas";
    
    const p = document.createElement("p");
    p.textContent = "No hay ofertas para este jugador actualmente.";
    divNoOfertas.appendChild(p);
    
    // Añadir botón para volver
    const botonVolver = document.createElement("button");
    botonVolver.textContent = "Volver a la plantilla";
    botonVolver.onclick = function() {
      window.location.href = "plantilla.html";
    };
    divNoOfertas.appendChild(botonVolver);
    
    div.appendChild(divNoOfertas);
    return;
  }
  
  // Mostrar detalles del jugador en venta
  const jugadorActual = jugadores.find(j => j.nombre === jugadorEnTransferencia);
  if (jugadorActual) {
    const infoJugador = document.createElement("div");
    infoJugador.className = "info-jugador-transferencia";
    
    infoJugador.innerHTML = `
      <h2>Ofertas para ${jugadorActual.nombre}</h2>
      <p><strong>Posición:</strong> ${jugadorActual.posicion} | <strong>Edad:</strong> ${jugadorActual.edad} años</p>
      <p><strong>Valoración:</strong> $${jugadorActual.valor.toLocaleString()} | <strong>Contrato:</strong> ${jugadorActual.contrato} meses</p>
      <p><strong>General:</strong> ${jugadorActual.general} | <strong>Potencial:</strong> ${jugadorActual.potencial}</p>
    `;
    
    div.appendChild(infoJugador);
  }
  
  // Crear un contenedor para todas las ofertas
  const contenedorOfertas = document.createElement("div");
  contenedorOfertas.className = "contenedor-ofertas";
  
  ofertas.forEach(oferta => {
    const ofertaDiv = document.createElement("div");
    ofertaDiv.className = "oferta-transferencia";
    
    // Determinar clase especial según tipo de oferta
    switch(oferta.tipoOferta) {
      case "venta":
        ofertaDiv.classList.add("oferta-venta");
        break;
      case "cesion":
      case "cesion_opcion":
      case "cesion_obligacion":
        ofertaDiv.classList.add("oferta-cesion");
        break;
      case "rescision":
        ofertaDiv.classList.add("oferta-rescision");
        break;
    }
    
    // Logo del club (si existe)
    const clubLogo = document.createElement("div");
    clubLogo.className = "club-logo";
    clubLogo.innerHTML = `<span>${oferta.clubInteresado.substring(0, 2)}</span>`;
    ofertaDiv.appendChild(clubLogo);
    
    // Contenido principal
    const contenido = document.createElement("div");
    contenido.className = "oferta-contenido";
    
    // Encabezado con tipo de oferta e importe
    const encabezado = document.createElement("div");
    encabezado.className = "oferta-encabezado";
    encabezado.innerHTML = `
      <h3>${oferta.detalles.tipoTransferencia}</h3>
      <div class="oferta-monto">$${oferta.oferta.toLocaleString()}</div>
    `;
    contenido.appendChild(encabezado);
    
    // Detalles del club interesado
    const clubInfo = document.createElement("div");
    clubInfo.className = "club-info";
    clubInfo.innerHTML = `<strong>${oferta.clubInteresado}</strong> (${oferta.pais}) - Club de nivel ${oferta.nivel}`;
    contenido.appendChild(clubInfo);
    
    // Detalles específicos según tipo de oferta
    const detallesDiv = document.createElement("div");
    detallesDiv.className = "oferta-detalles";
    
    // Detalles básicos
    let detallesHTML = `<p>${oferta.detalles.descripcion}</p>`;
    
    // Añadir detalles adicionales según el tipo de oferta
    if (oferta.tipoOferta.includes("cesion")) {
      detallesHTML += `
        <p>Duración: ${oferta.detalles.duracion}</p>
        <p>El club pagará el ${oferta.detalles.porcentajeSalario} del salario</p>
      `;
    }
    
    detallesDiv.innerHTML = detallesHTML;
    contenido.appendChild(detallesDiv);
    
    ofertaDiv.appendChild(contenido);
    
    // Botones de acción
    const botonesDiv = document.createElement("div");
    botonesDiv.className = "oferta-botones";
    
    const botonAceptar = document.createElement("button");
    botonAceptar.className = "btn-aceptar";
    botonAceptar.textContent = "Aceptar";
    botonAceptar.onclick = function() {
      aceptarOferta(oferta);
    };
    botonesDiv.appendChild(botonAceptar);
    
    const botonRechazar = document.createElement("button");
    botonRechazar.className = "btn-rechazar";
    botonRechazar.textContent = "Rechazar";
    botonRechazar.onclick = function() {
      rechazarOferta(oferta);
    };
    botonesDiv.appendChild(botonRechazar);
    
    ofertaDiv.appendChild(botonesDiv);
    
    contenedorOfertas.appendChild(ofertaDiv);
  });
  
  div.appendChild(contenedorOfertas);
  
  // Añadir botón para volver sin aceptar ninguna oferta
  const botonVolverDiv = document.createElement("div");
  botonVolverDiv.className = "btn-volver-container";
  
  const botonVolver = document.createElement("button");
  botonVolver.className = "btn-volver";
  botonVolver.textContent = "Volver sin vender";
  botonVolver.onclick = function() {
    window.location.href = "plantilla.html";
  };
  
  botonVolverDiv.appendChild(botonVolver);
  div.appendChild(botonVolverDiv);
}

// Función para aceptar una oferta
function aceptarOferta(oferta) {
  // Obtener jugadores vendidos actuales
  let jugadoresVendidos = JSON.parse(localStorage.getItem("jugadoresVendidos") || "[]");
  
  // Guardar información detallada de la transferencia
  let historialTransferencias = JSON.parse(localStorage.getItem("historialTransferencias") || "[]");
  
  // Fecha actual para la transferencia
  const fechaActual = new Date().toLocaleDateString();
  
  // Añadir dinero al presupuesto del club por la venta
  actualizarPresupuestoClub(oferta.oferta);
  
  // Registrar la transferencia en el historial
  historialTransferencias.push({
    jugador: oferta.jugador,
    desde: localStorage.getItem("selectedClub"),
    hacia: oferta.clubInteresado,
    monto: oferta.oferta,
    tipo: oferta.detalles.tipoTransferencia,
    detalles: oferta.detalles,
    fecha: fechaActual
  });
  localStorage.setItem("historialTransferencias", JSON.stringify(historialTransferencias));
  
  // Si es cesión temporal sin obligación de compra, no eliminamos permanentemente al jugador
  if (oferta.tipoOferta === "cesion") {
    // Marcar al jugador como cedido pero no eliminarlo completamente
    let jugadoresCedidos = JSON.parse(localStorage.getItem("jugadoresCedidos") || "[]");
    
    // Calcular fecha de retorno según duración
    const fechaRetorno = oferta.detalles.duracion === "6 meses" ? 
      new Date(new Date().setMonth(new Date().getMonth() + 6)).toLocaleDateString() : 
      new Date(new Date().setMonth(new Date().getMonth() + 12)).toLocaleDateString();
    
    jugadoresCedidos.push({
      nombre: oferta.jugador,
      club: oferta.clubInteresado,
      finPrestamo: fechaRetorno,
      valoracion: oferta.valor
    });
    localStorage.setItem("jugadoresCedidos", JSON.stringify(jugadoresCedidos));
    
    mostrarNotificacion(`¡Cesión completada! ${oferta.jugador} ha sido cedido al ${oferta.clubInteresado} por ${oferta.detalles.duracion}.`);
  } else {
    // En otros casos, añadir el jugador a la lista de vendidos permanentemente
    jugadoresVendidos.push(oferta.jugador);
    localStorage.setItem("jugadoresVendidos", JSON.stringify(jugadoresVendidos));
    
    mostrarNotificacion(`¡Oferta aceptada! Has transferido a ${oferta.jugador} al ${oferta.clubInteresado} por $${oferta.oferta.toLocaleString()} (${oferta.detalles.tipoTransferencia}).`);
  }
  
  // Redirigir de vuelta a la plantilla
  setTimeout(() => {
    window.location.href = "plantilla.html";
  }, 2000);
}

// Función para rechazar una oferta
function rechazarOferta(oferta) {
  // Remover la oferta del DOM
  const ofertaElement = event.target.closest('.oferta-transferencia');
  ofertaElement.classList.add('oferta-rechazada');
  
  setTimeout(() => {
    ofertaElement.remove();
    
    // Si ya no quedan ofertas, mostrar mensaje
    if (document.querySelectorAll(".oferta-transferencia").length === 0) {
      const div = document.getElementById("lista-ofertas");
      
      const noOfertas = document.createElement("div");
      noOfertas.className = "no-ofertas";
      
      const p = document.createElement("p");
      p.textContent = "No hay más ofertas disponibles.";
      noOfertas.appendChild(p);
      
      const botonVolver = document.createElement("button");
      botonVolver.className = "btn-volver";
      botonVolver.textContent = "Volver a la plantilla";
      botonVolver.onclick = function() {
        window.location.href = "plantilla.html";
      };
      noOfertas.appendChild(botonVolver);
      
      div.appendChild(noOfertas);
      
      // Eliminar el botón volver que estaba abajo si existe
      const btnVolverContainer = document.querySelector('.btn-volver-container');
      if (btnVolverContainer) {
        btnVolverContainer.remove();
      }
    }
  }, 500);
}

// Función para actualizar el presupuesto del club tras una venta
function actualizarPresupuestoClub(montoTransferencia) {
  // Obtener presupuesto actual
  let presupuestoClub = parseFloat(localStorage.getItem("presupuestoClub") || "0");
  
  // Añadir el monto de la transferencia
  presupuestoClub += montoTransferencia;
  
  // Guardar el nuevo presupuesto
  localStorage.setItem("presupuestoClub", presupuestoClub.toString());
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
  // Crear elemento de notificación
  const notificacion = document.createElement("div");
  notificacion.className = "notificacion";
  notificacion.textContent = mensaje;
  
  // Añadir al DOM
  document.body.appendChild(notificacion);
  
  // Mostrar con animación
  setTimeout(() => {
    notificacion.classList.add("mostrar");
  }, 100);
  
  // Eliminar después de 3 segundos
  setTimeout(() => {
    notificacion.classList.remove("mostrar");
    setTimeout(() => {
      document.body.removeChild(notificacion);
    }, 500);
  }, 3000);
}

// Ejecutar la función cuando la página esté lista
window.addEventListener("DOMContentLoaded", () => {
  mostrarOfertas();
});
