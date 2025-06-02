let jugadoresDelClub = [];
let filtroActual = 'TODOS';

function formatearDinero(valor) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(valor);
}

function cargarJugadores() {
    // Obtener el club seleccionado
    const clubSeleccionado = localStorage.getItem("selectedClub");
    const dtNombre = localStorage.getItem("coachName");
    
    if (!clubSeleccionado) {
        document.getElementById("listaJugadores").innerHTML = 
            '<div class="no-jugadores">❌ No hay club seleccionado.<br><small>Configura tu equipo primero.</small></div>';
        document.getElementById("clubInfo").innerHTML = 
            '<h2>❌ Club no configurado</h2>';
        return;
    }
    
    // Mostrar información del club
    document.getElementById("clubInfo").innerHTML = `
        <h2>⚽ ${clubSeleccionado}</h2>
        <p>🎯 Director Técnico: ${dtNombre || 'No asignado'}</p>
    `;
    
    // Obtener jugadores del localStorage
    const jugadoresPorClubData = localStorage.getItem("jugadoresPorClub");
    
    if (!jugadoresPorClubData) {
        document.getElementById("listaJugadores").innerHTML = 
            '<div class="no-jugadores">⚠️ No hay jugadores generados.<br><small>Ve al generador de jugadores primero.</small></div>';
        return;
    }
    
    try {
        const jugadoresPorClub = JSON.parse(jugadoresPorClubData);
        
        // Encontrar el ID del club
        let clubId = null;
        if (typeof clubes !== 'undefined') {
            const club = clubes.find(c => c.nombre === clubSeleccionado);
            clubId = club ? club.id : null;
        }
        
        if (!clubId || !jugadoresPorClub[clubId]) {
            document.getElementById("listaJugadores").innerHTML = 
                '<div class="no-jugadores">❌ No se encontraron jugadores para este club.<br><small>Regenera los jugadores si es necesario.</small></div>';
            return;
        }
        
        jugadoresDelClub = jugadoresPorClub[clubId];
        
        if (!Array.isArray(jugadoresDelClub) || jugadoresDelClub.length === 0) {
            document.getElementById("listaJugadores").innerHTML = 
                '<div class="no-jugadores">📭 No hay jugadores en este club</div>';
            return;
        }
        
        mostrarEstadisticas();
        mostrarJugadores();
        
    } catch (error) {
        document.getElementById("listaJugadores").innerHTML = 
            '<div class="no-jugadores">❌ Error al cargar los datos de jugadores</div>';
        console.error('Error parsing jugadores:', error);
    }
}

function mostrarEstadisticas() {
    if (jugadoresDelClub.length === 0) return;
    
    const stats = {
        total: jugadoresDelClub.length,
        porteros: jugadoresDelClub.filter(j => j.posicion === 'POR').length,
        defensas: jugadoresDelClub.filter(j => j.posicion === 'DEF').length,
        mediocampistas: jugadoresDelClub.filter(j => j.posicion === 'MED').length,
        delanteros: jugadoresDelClub.filter(j => j.posicion === 'DEL').length,
        promedioGeneral: Math.round(jugadoresDelClub.reduce((sum, j) => sum + j.general, 0) / jugadoresDelClub.length),
        valorTotal: jugadoresDelClub.reduce((sum, j) => sum + j.valor, 0)
    };
    
    document.getElementById("statsBar").innerHTML = `
        <div class="stat-item">
            <div class="stat-number">${stats.total}</div>
            <div class="stat-label">Total Jugadores</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">${stats.porteros}</div>
            <div class="stat-label">Porteros</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">${stats.defensas}</div>
            <div class="stat-label">Defensas</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">${stats.mediocampistas}</div>
            <div class="stat-label">Mediocampistas</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">${stats.delanteros}</div>
            <div class="stat-label">Delanteros</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">${stats.promedioGeneral}</div>
            <div class="stat-label">Promedio General</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">${formatearDinero(stats.valorTotal)}</div>
            <div class="stat-label">Valor Total</div>
        </div>
    `;
}

function obtenerEstadoEntrenamiento(jugadorId) {
    const entrenamientosData = localStorage.getItem("entrenamientosActivos");
    if (!entrenamientosData) return null;
    
    try {
        const entrenamientos = JSON.parse(entrenamientosData);
        return entrenamientos[jugadorId] || null;
    } catch (error) {
        return null;
    }
}

function mostrarJugadores() {
    let jugadoresFiltrados = jugadoresDelClub;
    
    if (filtroActual !== 'TODOS') {
        jugadoresFiltrados = jugadoresDelClub.filter(j => j.posicion === filtroActual);
    }
    
    // Ordenar por general (mayor a menor)
    jugadoresFiltrados.sort((a, b) => b.general - a.general);
    
    let html = '';
    jugadoresFiltrados.forEach((jugador, index) => {
        const estadoEntrenamiento = obtenerEstadoEntrenamiento(jugador.id || index);
        let estadoHtml = '';
        let botonEntrenamiento = '';
        
        if (estadoEntrenamiento) {
            const ahora = new Date().getTime();
            const tiempoRestante = estadoEntrenamiento.finalizaEn - ahora;
            
            if (tiempoRestante > 0) {
                const horas = Math.floor(tiempoRestante / (1000 * 60 * 60));
                const minutos = Math.floor((tiempoRestante % (1000 * 60 * 60)) / (1000 * 60));
                estadoHtml = `<div class="entrenamiento-status">⏱️ Entrenando: ${horas}h ${minutos}m</div>`;
                botonEntrenamiento = `<button class="entrenamiento-btn" disabled style="opacity: 0.5;">🏃‍♂️ En Entrenamiento</button>`;
            } else {
                estadoHtml = `<div class="entrenamiento-status completado">✅ Listo para recoger</div>`;
                botonEntrenamiento = `<button class="entrenamiento-btn" onclick="recogerEntrenamiento(${jugador.id || index})">🎁 Recoger Entrenamiento</button>`;
            }
        } else {
            botonEntrenamiento = `<button class="entrenamiento-btn" onclick="irAEntrenamiento(${jugador.id || index})">🏃‍♂️ Entrenar</button>`;
        }
        
        html += `
            <div class="jugador-card">
                <div class="jugador-header">
                    <div class="jugador-nombre">${jugador.nombre || 'Sin nombre'}</div>
                    <div class="jugador-posicion">${jugador.posicion}</div>
                </div>
                ${estadoHtml}
                <div class="jugador-info">
                    <div class="info-section">
                        <div class="info-item">
                            <span class="info-label">Edad:</span>
                            <span class="info-value">${jugador.edad} años</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">General:</span>
                            <span class="info-value">${jugador.general}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Potencial:</span>
                            <span class="info-value">${jugador.potencial}</span>
                        </div>
                    </div>
                    <div class="info-section">
                        <div class="info-item">
                            <span class="info-label">Sprint:</span>
                            <span class="info-value">${jugador.sprint}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Regate:</span>
                            <span class="info-value">${jugador.regate}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Pase:</span>
                            <span class="info-value">${jugador.pase}</span>
                        </div>
                    </div>
                    <div class="info-section">
                        <div class="info-item">
                            <span class="info-label">Tiro:</span>
                            <span class="info-value">${jugador.tiro}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Defensa:</span>
                            <span class="info-value">${jugador.defensa}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Resistencia:</span>
                            <span class="info-value">${jugador.resistencia}</span>
                        </div>
                    </div>
                    <div class="info-section">
                        <div class="info-item">
                            <span class="info-label">Valor:</span>
                            <span class="info-value valor-money">${formatearDinero(jugador.valor)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Sueldo:</span>
                            <span class="info-value valor-money">${formatearDinero(jugador.sueldo)}</span>
                        </div>
                    </div>
                </div>
                <div class="jugador-actions">
                    ${botonEntrenamiento}
                </div>
            </div>
        `;
    });
    
    document.getElementById("listaJugadores").innerHTML = html;
}

function irAEntrenamiento(jugadorId) {
    // Guardar el ID del jugador seleccionado
    localStorage.setItem("jugadorParaEntrenar", jugadorId);
    // Redirigir a la página de entrenamiento
    window.location.href = "entrenamiento.html";
}

function recogerEntrenamiento(jugadorId) {
    const entrenamientosData = localStorage.getItem("entrenamientosActivos");
    if (!entrenamientosData) return;
    
    try {
        const entrenamientos = JSON.parse(entrenamientosData);
        const entrenamiento = entrenamientos[jugadorId];
        
        if (!entrenamiento) return;
        
        // Aplicar mejoras al jugador
        aplicarMejorasEntrenamiento(jugadorId, entrenamiento);
        
        // Eliminar el entrenamiento activo
        delete entrenamientos[jugadorId];
        localStorage.setItem("entrenamientosActivos", JSON.stringify(entrenamientos));
        
        // Recargar la vista
        cargarJugadores();
        
        alert(`¡Entrenamiento completado! ${entrenamiento.tipo} ha mejorado las habilidades del jugador.`);
        
    } catch (error) {
        console.error('Error al recoger entrenamiento:', error);
    }
}

function aplicarMejorasEntrenamiento(jugadorId, entrenamiento) {
    const jugadoresPorClubData = localStorage.getItem("jugadoresPorClub");
    if (!jugadoresPorClubData) return;
    
    try {
        const jugadoresPorClub = JSON.parse(jugadoresPorClubData);
        const clubSeleccionado = localStorage.getItem("selectedClub");
        
        if (!clubSeleccionado) return;
        
        let clubId = null;
        if (typeof clubes !== 'undefined') {
            const club = clubes.find(c => c.nombre === clubSeleccionado);
            clubId = club ? club.id : null;
        }
        
        if (!clubId || !jugadoresPorClub[clubId]) return;
        
        const jugador = jugadoresPorClub[clubId][jugadorId];
        if (!jugador) return;
        
        // Aplicar mejoras según el tipo de entrenamiento
        const mejoras = entrenamiento.mejoras;
        Object.keys(mejoras).forEach(stat => {
            if (jugador[stat] !== undefined) {
                jugador[stat] = Math.min(99, jugador[stat] + mejoras[stat]);
            }
        });
        
        // Si cambió de posición, aplicar el cambio
        if (entrenamiento.nuevaPosicion && entrenamiento.nuevaPosicion !== jugador.posicion) {
            jugador.posicion = entrenamiento.nuevaPosicion;
        }
        
        // Recalcular general y valor
        jugador.general = Math.round((jugador.sprint + jugador.regate + jugador.pase + jugador.tiro + jugador.defensa + jugador.resistencia) / 6);
        jugador.valor = Math.round(jugador.valor * (1 + (Math.random() * 0.1 + 0.05))); // Incremento del 5-15%
        jugador.sueldo = Math.round(jugador.valor * 0.01); // 1% del valor como sueldo
        
        // Guardar cambios
        localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
        
    } catch (error) {
        console.error('Error al aplicar mejoras:', error);
    }
}

function filtrarPorPosicion(posicion) {
    filtroActual = posicion;
    
    // Actualizar botones activos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    mostrarJugadores();
}

// Cargar jugadores al iniciar la página
window.addEventListener('load', cargarJugadores);

// Actualizar cada 30 segundos por si hay cambios
setInterval(cargarJugadores, 30000);
