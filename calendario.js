// Inicialización del calendario
document.addEventListener("DOMContentLoaded", function() {
    inicializarFecha();
    actualizarDisplay();
    
    // Event listeners para botones
    document.getElementById("avanzar-dia").addEventListener("click", () => avanzarTiempo(1));
    document.getElementById("avanzar-semana").addEventListener("click", () => avanzarTiempo(7));
    document.getElementById("avanzar-mes").addEventListener("click", () => avanzarTiempo(30));
});

// Función para inicializar la fecha del juego
function inicializarFecha() {
    let fechaJuego = localStorage.getItem("fechaJuego");
    
    if (!fechaJuego) {
        // Primera vez: establecer fecha inicial
        const fechaInicio = new Date("2025-01-01");
        localStorage.setItem("fechaJuego", fechaInicio.toISOString());
        console.log("Fecha del juego inicializada: 01/01/2025");
    }
}

// Función para obtener la fecha actual del juego
function obtenerFechaJuego() {
    const fechaString = localStorage.getItem("fechaJuego");
    return new Date(fechaString);
}

// FUNCIÓN PRINCIPAL: Avanzar el tiempo
function avanzarTiempo(dias) {
    const fechaActual = obtenerFechaJuego();
    fechaActual.setDate(fechaActual.getDate() + dias);
    
    localStorage.setItem("fechaJuego", fechaActual.toISOString());
    
    console.log(`⏰ Tiempo avanzado ${dias} día(s). Nueva fecha: ${fechaActual.toLocaleDateString()}`);
    
    // Actualizar display
    actualizarDisplay();
    
    // Notificar cambio para que otras funciones se actualicen
    notificarCambioFecha();
}

// Función para notificar cambio de fecha
function notificarCambioFecha() {
    // Crear evento personalizado para notificar cambio de fecha
    const evento = new CustomEvent('fechaCambiada', {
        detail: { 
            fecha: obtenerFechaJuego(),
            timestamp: Date.now() 
        }
    });
    
    // Disparar el evento
    window.dispatchEvent(evento);
    
    console.log('📡 Evento de cambio de fecha disparado');
}

// Función para actualizar el display de fecha
function actualizarDisplay() {
    const fecha = obtenerFechaJuego();
    const opciones = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
    document.getElementById("fecha-display").textContent = fechaFormateada;
}

// Función para resetear calendario (útil para desarrollo/testing)
function resetearCalendario() {
    if (confirm("¿Estás seguro de resetear el calendario al 01/01/2025?")) {
        const fechaInicio = new Date("2025-01-01");
        localStorage.setItem("fechaJuego", fechaInicio.toISOString());
        
        actualizarDisplay();
        notificarCambioFecha();
        
        console.log("📅 Calendario reseteado al 01/01/2025");
    }
}
