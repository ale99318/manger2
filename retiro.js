function evaluarRetiro(jugador) {
  // Retiro forzoso por edad
  if (jugador.edad >= 45) {
    jugador.retirado = true;
    jugador.motivoRetiro = "Edad máxima alcanzada";
    return true;
  }
  
  // Posible retiro desde los 36 años en adelante
  if (jugador.edad >= 36) {
    const probabilidadBase = Math.pow((jugador.edad - 35), 2) / 100; // crece con la edad
    const suerte = Math.random();
    
    // Retiro forzado a los 45 años
    if (jugador.edad === 45 && suerte <= 0.999) {
      jugador.retirado = true;
      jugador.motivoRetiro = "Retiro forzado a los 45 años";
      return true;
    }
    
    if (suerte < probabilidadBase) {
      jugador.retirado = true;
      jugador.motivoRetiro = "Retiro voluntario por edad";
      return true;
    }
  }
  
  // Retiro por lesión mortal
  if (jugador.ultimaLesion && jugador.ultimaLesion.gravedad === "mortal") {
    jugador.retirado = true;
    jugador.motivoRetiro = "Lesión mortal";
    return true;
  }
  
  // Retiro por historial de lesiones graves o repetidas
  const lesiones = jugador.lesiones || [];
  const lesionesGraves = lesiones.filter(l => l.gravedad === "grave" || l.gravedad === "crítica").length;
  const tieneSecuelas = lesiones.some(l => l.secuelas);
  const lesionesRecientes = lesiones.slice(-3); // últimas 3 lesiones
  const muchasLesionesSeguidas = lesionesRecientes.length >= 3;
  
  if ((lesionesGraves >= 3 || muchasLesionesSeguidas || tieneSecuelas) && Math.random() < 0.5) {
    jugador.retirado = true;
    jugador.motivoRetiro = "Problemas físicos recurrentes";
    return true;
  }
  
  return false; // No se retira
}

// Función para evaluar retiro de todos los jugadores
function evaluarRetirosGenerales() {
  let jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
  let huboRetiros = false;
  
  jugadores.forEach(jugador => {
    if (!jugador.retirado) {
      if (evaluarRetiro(jugador)) {
        huboRetiros = true;
      }
    }
  });
  
  if (huboRetiros) {
    localStorage.setItem("jugadores", JSON.stringify(jugadores));
  }
}

// Función para obtener jugadores retirados
function obtenerJugadoresRetirados() {
  const jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
  return jugadores.filter(jugador => jugador.retirado);
}

// Función para obtener jugadores activos
function obtenerJugadoresActivos() {
  const jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
  return jugadores.filter(jugador => !jugador.retirado);
}
