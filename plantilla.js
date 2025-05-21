// Código para inicializar datos (coloca esto en un archivo init.js o al principio de tu aplicación)
document.addEventListener("DOMContentLoaded", function() {
  // Verificar si los jugadores ya están en localStorage para no sobrescribirlos
  if (!localStorage.getItem("jugadores")) {
    // Si no están en localStorage, cargar los jugadores desde la constante 'jugadores'
    // definida en paste.txt e inicializar el localStorage
    localStorage.setItem("jugadores", JSON.stringify(jugadores));
    console.log("Jugadores inicializados en localStorage");
  }
});

// Código para la página de plantilla (tu código actual corregido)
document.addEventListener("DOMContentLoaded", function() {
  // Obtener el nombre del club guardado en localStorage
  const selectedClub = localStorage.getItem("selectedClub");
  
  // Validar si hay club seleccionado
  if (!selectedClub) {
    alert("No hay club seleccionado. Redirigiendo a selección de club.");
    // Redirigir a la página de selección de club
    window.location.href = "seleccion-club.html"; // Ajusta esta URL a tu estructura
    return; // Detener ejecución
  }
  
  // Mostrar el nombre del club
  const nombreClubElement = document.getElementById("nombre-club");
  if (nombreClubElement) {
    nombreClubElement.textContent = selectedClub;
  }
  
  // Obtener la lista de jugadores
  const jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
  console.log("Total de jugadores cargados:", jugadores.length);
  
  // Obtener jugadores vendidos y cedidos
  let jugadoresVendidos = JSON.parse(localStorage.getItem("jugadoresVendidos") || "[]");
  let jugadoresCedidos = JSON.parse(localStorage.getItem("jugadoresCedidos") || "[]");
  
  // Filtrar jugadores del club que no están vendidos ni cedidos
  const jugadoresDelClub = jugadores.filter(jugador => 
    jugador.club === selectedClub && 
    !jugadoresVendidos.includes(jugador.nombre) &&
    !jugadoresCedidos.some(cedido => cedido.nombre === jugador.nombre)
  );
  
  console.log("Jugadores del club filtrados:", jugadoresDelClub);
  
  // Crear botón de resetear ventas
  const seccionClub = document.querySelector(".seccion-club");
  if (seccionClub) {
    const botonResetear = document.createElement("button");
    botonResetear.textContent = "Resetear Transferencias";
    botonResetear.classList.add("btn-reset");
    botonResetear.onclick = resetearTransferencias;
    seccionClub.appendChild(botonResetear);
  }
  
  // Contenedor para mostrar info del club
  const contenedor = document.getElementById("info-club");
  if (!contenedor) {
    console.error("No se encontró el elemento con ID 'info-club'");
    return;
  }
  
  contenedor.innerHTML = "";
  
  // Título jugadores disponibles
  const tituloDisponibles = document.createElement("h2");
  tituloDisponibles.textContent = "Jugadores Disponibles";
  contenedor.appendChild(tituloDisponibles);
  
  // Verificar si hay jugadores para mostrar
  if (jugadoresDelClub.length === 0) {
    const noJugadores = document.createElement("p");
    noJugadores.textContent = "No hay jugadores disponibles para este club.";
    noJugadores.style.fontStyle = "italic";
    contenedor.appendChild(noJugadores);
  } else {
    // Agregar jugadores disponibles
    jugadoresDelClub.forEach(jugador => {
      const div = document.createElement("div");
      div.classList.add("jugador-item");
      
      // Crear contenedor de información del jugador
      const infoJugador = document.createElement("div");
      infoJugador.classList.add("info-jugador");
      infoJugador.innerHTML = `
        <strong>${jugador.nombre}</strong> - ${jugador.posicion} (${jugador.edad} años)
        <div class="stats">
          <span>General: ${jugador.general}</span>
          <span>Valor: $${(jugador.valor/1000000).toFixed(1)}M</span>
        </div>
      `;
      div.appendChild(infoJugador);
      
      // Botón para vender
      const botonVender = document.createElement("button");
      botonVender.textContent = "Poner en venta";
      botonVender.classList.add("btn-vender");
      botonVender.onclick = () => ponerEnVenta(jugador);
      div.appendChild(botonVender);
      
      contenedor.appendChild(div);
    });
  }
  
  // Mostrar jugadores cedidos si hay
  const jugadoresCedidosDelClub = jugadoresCedidos.filter(cedido => {
    const jugadorCompleto = jugadores.find(j => j.nombre === cedido.nombre);
    return jugadorCompleto && jugadorCompleto.club === selectedClub;
  });
  
  if (jugadoresCedidosDelClub.length > 0) {
    const tituloCedidos = document.createElement("h2");
    tituloCedidos.textContent = "Jugadores Cedidos";
    tituloCedidos.style.marginTop = "20px";
    contenedor.appendChild(tituloCedidos);
    
    jugadoresCedidosDelClub.forEach(cedido => {
      const div = document.createElement("div");
      div.classList.add("jugador-cedido");
      div.textContent = `${cedido.nombre} (Cedido al ${cedido.club} hasta ${cedido.finPrestamo})`;
      contenedor.appendChild(div);
    });
  }
});

// Función para poner en venta a un jugador
function ponerEnVenta(jugador) {
  // Obtener lista completa de jugadores
  const jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
  
  // Encontrar el jugador en la lista completa y marcarlo en venta
  const jugadorIndex = jugadores.findIndex(j => j.id === jugador.id);
  if (jugadorIndex !== -1) {
    jugadores[jugadorIndex].enVenta = true;
    
    // Guardar la lista actualizada
    localStorage.setItem("jugadores", JSON.stringify(jugadores));
    
    // Guardar jugador seleccionado para transferencia
    localStorage.setItem("jugadorEnTransferencia", jugador.nombre);
    
    // Redirigir a ofertas.html
    window.location.href = "ofertas.html";
  } else {
    console.error("No se encontró el jugador", jugador);
  }
}

// Función para resetear transferencias
function resetearTransferencias() {
  if (confirm("¿Estás seguro de que deseas resetear todas las transferencias?")) {
    localStorage.removeItem("jugadoresVendidos");
    localStorage.removeItem("jugadoresCedidos");
    localStorage.removeItem("historialTransferencias");
    
    // Obtener y actualizar jugadores
    const jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
    jugadores.forEach(jugador => {
      jugador.enVenta = false;
    });
    localStorage.setItem("jugadores", JSON.stringify(jugadores));
    
    alert("Transferencias reseteadas correctamente");
    location.reload();
  }
}

// Función para seleccionar club (agregar esto a tu página de selección de club)
function seleccionarClub(nombreClub) {
  localStorage.setItem("selectedClub", nombreClub);
  window.location.href = "plantilla.html"; // Redirigir a la página de plantilla
}
