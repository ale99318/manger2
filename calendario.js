// Inicialización del calendario 
document.addEventListener("DOMContentLoaded", function() {
    inicializarFecha();
    actualizarDisplay();
    verificarContratos();
    
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

// Función para avanzar el tiempo
function avanzarTiempo(dias) {
    const fechaActual = obtenerFechaJuego();
    fechaActual.setDate(fechaActual.getDate() + dias);
    
    localStorage.setItem("fechaJuego", fechaActual.toISOString());
    
    console.log(`Tiempo avanzado ${dias} día(s). Nueva fecha: ${fechaActual.toLocaleDateString()}`);
    
    actualizarDisplay();
    verificarContratos();
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

// Función para verificar contratos
function verificarContratos() {
    const jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
    const fechaActual = obtenerFechaJuego();
    
    let contratosVencidos = [];
    let contratosPorVencer = [];
    let contratosActivos = 0;
    let contratosSinFecha = 0;
    
    jugadores.forEach(jugador => {
        if (jugador.contrato && jugador.contrato.fechaVencimiento) {
            const fechaVencimiento = new Date(jugador.contrato.fechaVencimiento);
            const diasParaVencer = Math.ceil((fechaVencimiento - fechaActual) / (1000 * 60 * 60 * 24));
            
            if (diasParaVencer < 0) {
                // Contrato vencido
                contratosVencidos.push({
                    jugador: jugador,
                    diasVencido: Math.abs(diasParaVencer)
                });
            } else if (diasParaVencer <= 30) {
                // Contrato por vencer en 30 días
                contratosPorVencer.push({
                    jugador: jugador,
                    diasRestantes: diasParaVencer
                });
            } else {
                contratosActivos++;
            }
        } else if (jugador.contrato) {
            contratosSinFecha++;
        }
    });
    
    // Actualizar información general
    actualizarInfoContratos(contratosActivos, contratosSinFecha, jugadores.length);
    
    // Mostrar contratos vencidos
    mostrarContratosVencidos(contratosVencidos);
    
    // Mostrar contratos por vencer
    mostrarContratosPorVencer(contratosPorVencer);
    
    // Procesar contratos vencidos automáticamente
    procesarContratosVencidos(contratosVencidos);
}

// Función para actualizar información general de contratos
function actualizarInfoContratos(activos, sinFecha, total) {
    const infoElement = document.getElementById("contratos-info");
    
    infoElement.innerHTML = `
        <p><strong>Total de jugadores:</strong> ${total}</p>
        <p><strong>Contratos activos:</strong> ${activos}</p>
        <p><strong>Contratos sin fecha:</strong> ${sinFecha}</p>
    `;
}

// Función para mostrar contratos vencidos
function mostrarContratosVencidos(contratosVencidos) {
    const contenedor = document.getElementById("contratos-vencidos");
    const lista = document.getElementById("lista-vencidos");
    
    if (contratosVencidos.length > 0) {
        contenedor.style.display = "block";
        lista.innerHTML = "";
        
        contratosVencidos.forEach(item => {
            const div = document.createElement("div");
            div.innerHTML = `
                <p><strong>${item.jugador.nombre}</strong> - ${item.jugador.posicion}</p>
                <p>🚫 ELIMINADO - Contrato vencido hace ${item.diasVencido} día(s)</p>
                <p>Ex-Club: ${item.jugador.club}</p>
                <hr>
            `;
            lista.appendChild(div);
        });
    } else {
        contenedor.style.display = "none";
    }
}

// Función para mostrar contratos por vencer
function mostrarContratosPorVencer(contratosPorVencer) {
    const contenedor = document.getElementById("contratos-proximos");
    const lista = document.getElementById("lista-proximos");
    
    if (contratosPorVencer.length > 0) {
        contenedor.style.display = "block";
        lista.innerHTML = "";
        
        contratosPorVencer.forEach(item => {
            const div = document.createElement("div");
            div.innerHTML = `
                <p><strong>${item.jugador.nombre}</strong> - ${item.jugador.posicion}</p>
                <p>Contrato vence en ${item.diasRestantes} día(s)</p>
                <p>Club: ${item.jugador.club}</p>
                <hr>
            `;
            lista.appendChild(div);
        });
    } else {
        contenedor.style.display = "none";
    }
}

// Función para procesar contratos vencidos
function procesarContratosVencidos(contratosVencidos) {
    if (contratosVencidos.length === 0) return;
    
    let jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
    let jugadoresEliminados = [];
    
    contratosVencidos.forEach(item => {
        const jugadorIndex = jugadores.findIndex(j => j.id === item.jugador.id);
        
        if (jugadorIndex !== -1) {
            // Guardar información del jugador eliminado para el historial
            jugadoresEliminados.push({
                nombre: jugadores[jugadorIndex].nombre,
                posicion: jugadores[jugadorIndex].posicion,
                club: jugadores[jugadorIndex].club,
                fechaEliminacion: new Date().toISOString(),
                motivo: "Contrato vencido"
            });
            
            // Eliminar jugador de la plantilla
            jugadores.splice(jugadorIndex, 1);
            
            console.log(`Jugador eliminado por contrato vencido: ${item.jugador.nombre}`);
        }
    });
    
    if (jugadoresEliminados.length > 0) {
        // Guardar lista actualizada de jugadores
        localStorage.setItem("jugadores", JSON.stringify(jugadores));
        
        // Guardar historial de jugadores eliminados
        guardarHistorialEliminados(jugadoresEliminados);
        
        console.log(`${jugadoresEliminados.length} jugador(es) eliminado(s) por contrato vencido`);
    }
}

// Función para resetear calendario (útil para desarrollo/testing)
function resetearCalendario() {
    if (confirm("¿Estás seguro de resetear el calendario al 01/01/2025?")) {
        const fechaInicio = new Date("2025-01-01");
        localStorage.setItem("fechaJuego", fechaInicio.toISOString());
        
        actualizarDisplay();
        verificarContratos();
        
        console.log("Calendario reseteado al 01/01/2025");
    }
}

// Función para guardar historial de jugadores eliminados
function guardarHistorialEliminados(jugadoresEliminados) {
    let historial = JSON.parse(localStorage.getItem('historialEliminados') || '[]');
    
    jugadoresEliminados.forEach(jugador => {
        historial.unshift(jugador); // Agregar al inicio
    });
    
    // Mantener solo los últimos 50 eliminaciones
    if (historial.length > 50) {
        historial = historial.slice(0, 50);
    }
    
    localStorage.setItem('historialEliminados', JSON.stringify(historial));
}
