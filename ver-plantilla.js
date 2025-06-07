// Cargar plantilla al iniciar
document.addEventListener('DOMContentLoaded', function() {
    cargarPlantilla();
});

function cargarPlantilla() {
    // Obtener club seleccionado
    const clubSeleccionado = localStorage.getItem('selectedClub');
    
    if (!clubSeleccionado) {
        mostrarError('No se ha seleccionado un club');
        return;
    }
    
    document.getElementById('club-name').textContent = clubSeleccionado;
    
    // Obtener jugadores
    const jugadoresData = localStorage.getItem('jugadoresPorClub');
    
    if (!jugadoresData) {
        mostrarError('No se encontró plantilla generada');
        return;
    }
    
    const jugadoresPorClub = JSON.parse(jugadoresData);
    
    // Encontrar jugadores del club
    let jugadoresClub = [];
    for (const clubId in jugadoresPorClub) {
        if (jugadoresPorClub[clubId].length > 0) {
            jugadoresClub = jugadoresPorClub[clubId];
            break;
        }
    }
    
    if (jugadoresClub.length === 0) {
        mostrarError('No se encontraron jugadores');
        return;
    }
    
    document.getElementById('total-jugadores').textContent = `${jugadoresClub.length} jugadores`;
    mostrarJugadores(jugadoresClub);
}

function mostrarJugadores(jugadores) {
    const container = document.getElementById('jugadores-container');
    
    const html = jugadores.map(jugador => {
        const lesionText = jugador.lesion ? `🏥 ${jugador.lesion.nombre} (${jugador.lesion.diasRestantes} días)` : '';
        
        return `
            <div class="jugador-card">
                <div class="jugador-header">
                    <div class="jugador-info">
                        <h3>${jugador.nombre}</h3>
                        <p>${jugador.edad} años</p>
                    </div>
                    <span class="posicion-badge posicion-${jugador.posicion}">${jugador.posicion}</span>
                </div>
                
                <div class="jugador-stats">
                    <div class="stat-item">
                        <span class="stat-label">General</span>
                        <span class="stat-value">${jugador.general}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Potencial</span>
                        <span class="stat-value">${jugador.potencial}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Estado Físico</span>
                        <span class="stat-value">${jugador.estadoFisico}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Cansancio</span>
                        <span class="stat-value">${jugador.cansancio}%</span>
                    </div>
                </div>
                
                <div class="valor-mercado">
                    <span class="label">Valor de Mercado</span>
                    <span class="value">$${jugador.valorMercado.toLocaleString()}</span>
                </div>
                
                ${jugador.lesion ? `<div class="lesion-info">${lesionText}</div>` : ''}
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

function mostrarError(mensaje) {
    document.getElementById('jugadores-container').innerHTML = `
        <div class="no-data">
            <p>${mensaje}</p>
        </div>
    `;
}

function refreshPlantilla() {
    cargarPlantilla();
}

function goBack() {
    window.history.back();
}

