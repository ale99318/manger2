// años.js- Maneja la integración con el sistema de calendario y envejecimiento

document.addEventListener("DOMContentLoaded", function() {
    inicializarJugadores();
    mostrarJugadores();
    
    // Escuchar el evento de cambio de fecha del sistema de calendario
    window.addEventListener('fechaCambiada', function(evento) {
        console.log('📅 Fecha cambió, verificando envejecimiento de jugadores...');
        verificarEnvejecimientoJugadores();
        mostrarJugadores(); // Actualizar la vista
    });
});

// Inicializar jugadores en localStorage si no existen
function inicializarJugadores() {
    let jugadoresGuardados = localStorage.getItem("jugadores");
    
    if (!jugadoresGuardados) {
        // Primera vez: guardar los jugadores iniciales
        localStorage.setItem("jugadores", JSON.stringify(jugadores));
        // Inicializar fecha de referencia para envejecimiento
        localStorage.setItem("fechaReferenciaEnvejecimiento", new Date("2025-01-01").toISOString());
        console.log("✅ Jugadores inicializados en localStorage");
    } else {
        // Verificar si hay jugadores nuevos para agregar
        let jugadoresExistentes = JSON.parse(jugadoresGuardados);
        let jugadoresAgregados = [];
        
        jugadores.forEach(jugadorNuevo => {
            let existe = jugadoresExistentes.find(j => j.id === jugadorNuevo.id);
            if (!existe) {
                jugadoresExistentes.push(jugadorNuevo);
                jugadoresAgregados.push(jugadorNuevo.nombre);
            }
        });
        
        if (jugadoresAgregados.length > 0) {
            localStorage.setItem("jugadores", JSON.stringify(jugadoresExistentes));
            console.log(`✅ ${jugadoresAgregados.length} jugadores nuevos agregados: ${jugadoresAgregados.join(', ')}`);
        }
        
        // Inicializar fecha de referencia si no existe
        if (!localStorage.getItem("fechaReferenciaEnvejecimiento")) {
            localStorage.setItem("fechaReferenciaEnvejecimiento", new Date("2025-01-01").toISOString());
        }
    }
}

// Verificar envejecimiento basado en el sistema de calendario
function verificarEnvejecimientoJugadores() {
    // Obtener fecha actual del juego y fecha de referencia
    const fechaActual = new Date(localStorage.getItem("fechaJuego"));
    const fechaReferencia = new Date(localStorage.getItem("fechaReferenciaEnvejecimiento"));
    
    // Calcular años transcurridos
    const diferenciaEnMs = fechaActual - fechaReferencia;
    const añosTranscurridos = Math.floor(diferenciaEnMs / (1000 * 60 * 60 * 24 * 365));
    
    if (añosTranscurridos > 0) {
        console.log(`📈 Han transcurrido ${añosTranscurridos} año(s) desde la última actualización`);
        
        // Obtener jugadores
        let jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
        let jugadoresEnvejecidos = 0;
        
        // Envejecer cada jugador
        jugadores.forEach(jugador => {
            if (!jugador.retirado) {
                const edadAnterior = jugador.edad;
                jugador.edad += añosTranscurridos;
                
                console.log(`🎂 ${jugador.nombre}: ${edadAnterior} → ${jugador.edad} años (+${añosTranscurridos})`);
                jugadoresEnvejecidos++;
            }
        });
        
        // Guardar jugadores actualizados
        localStorage.setItem("jugadores", JSON.stringify(jugadores));
        
        // Actualizar fecha de referencia para próximo envejecimiento
        fechaReferencia.setFullYear(fechaReferencia.getFullYear() + añosTranscurridos);
        localStorage.setItem("fechaReferenciaEnvejecimiento", fechaReferencia.toISOString());
        
        console.log(`✅ ${jugadoresEnvejecidos} jugadores envejecieron ${añosTranscurridos} año(s)`);
    } else {
        console.log('🔄 No ha pasado suficiente tiempo para envejecer jugadores');
    }
}

// Mostrar jugadores en el DOM (TODOS los jugadores, activos y retirados)
function mostrarJugadores() {
    let jugadoresGuardados = JSON.parse(localStorage.getItem("jugadores") || "[]");
    
    const playersGrid = document.getElementById("playersGrid");
    const totalJugadores = document.getElementById("totalJugadores");
    
    if (!playersGrid || !totalJugadores) return;
    
    // Actualizar contador con TODOS los jugadores
    totalJugadores.textContent = jugadoresGuardados.length;
    
    // Limpiar grid
    playersGrid.innerHTML = "";
    
    if (jugadoresGuardados.length === 0) {
        playersGrid.innerHTML = "<p>No hay jugadores disponibles</p>";
        return;
    }
    
    // Mostrar cada jugador (activos y retirados)
    jugadoresGuardados.forEach(jugador => {
        const playerCard = document.createElement("div");
        playerCard.className = `player-card ${jugador.retirado ? 'retirado' : ''}`;
        
        playerCard.innerHTML = `
            <div class="player-header">
                <h3>${jugador.nombre}</h3>
                <span class="club">${jugador.club}</span>
                ${jugador.retirado ? '<span class="estado-retiro">RETIRADO</span>' : ''}
            </div>
            <div class="player-info">
                <p><strong>Posición:</strong> ${jugador.posicion}</p>
                <p><strong>Edad:</strong> ${jugador.edad} años</p>
                <p><strong>General:</strong> ${jugador.general}</p>
                <p><strong>Potencial:</strong> ${jugador.potencial}</p>
                ${jugador.retirado ? `<p><strong>Motivo retiro:</strong> ${jugador.motivoRetiro}</p>` : ''}
            </div>
            <div class="player-stats">
                <div class="stat-row">
                    <span>Sprint: ${jugador.sprint}</span>
                    <span>Regate: ${jugador.regate}</span>
                </div>
                <div class="stat-row">
                    <span>Pase: ${jugador.pase}</span>
                    <span>Tiro: ${jugador.tiro}</span>
                </div>
                <div class="stat-row">
                    <span>Defensa: ${jugador.defensa}</span>
                    <span>Liderazgo: ${jugador.liderazgo}</span>
                </div>
            </div>
            <div class="player-status">
                <p><strong>Estado:</strong> ${jugador.estado_animo} ${jugador.personalidad}</p>
                <p><strong>Energía:</strong> ${jugador.energia}%</p>
                <p><strong>Titular:</strong> ${jugador.titular ? 'Sí' : 'No'}</p>
                <p><strong>Valor:</strong> $${jugador.valor.toLocaleString()}</p>
            </div>
        `;
        
        playersGrid.appendChild(playerCard);
    });
}

// Función para obtener jugadores actuales (útil para otros scripts)
function obtenerJugadores() {
    return JSON.parse(localStorage.getItem("jugadores") || "[]");
}

// Función para obtener solo jugadores activos
function obtenerJugadoresActivos() {
    return obtenerJugadores().filter(j => !j.retirado);
}

// Exportar funciones globalmente para compatibilidad
window.obtenerJugadores = obtenerJugadores;
window.obtenerJugadoresActivos = obtenerJugadoresActivos;
window.mostrarJugadores = mostrarJugadores;
