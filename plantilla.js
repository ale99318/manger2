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
    
    // Validar elemento DOM
    const clubNameElement = document.getElementById('club-name');
    if (clubNameElement) {
        clubNameElement.textContent = clubSeleccionado;
    }
    
    // Obtener jugadores
    const jugadoresData = localStorage.getItem('jugadoresPorClub');
    
    if (!jugadoresData) {
        mostrarError('No se encontró plantilla generada');
        return;
    }
    
    let jugadoresPorClub;
    try {
        jugadoresPorClub = JSON.parse(jugadoresData);
    } catch (error) {
        mostrarError('Error al cargar los datos de jugadores');
        console.error('Error parsing JSON:', error);
        return;
    }
    
    // Buscar el ID del club usando clubes.js
    let jugadoresClub = [];
    
    if (typeof clubes !== 'undefined') {
        const club = clubes.find(c => c.nombre === clubSeleccionado);
        if (club && jugadoresPorClub[club.id]) {
            jugadoresClub = jugadoresPorClub[club.id];
        }
    }
    
    if (jugadoresClub.length === 0) {
        mostrarError('No se encontraron jugadores para este club');
        return;
    }
    
    const totalJugadoresElement = document.getElementById('total-jugadores');
    if (totalJugadoresElement) {
        totalJugadoresElement.textContent = `${jugadoresClub.length} jugadores`;
    }
    
    mostrarJugadores(jugadoresClub);
}

function mostrarJugadores(jugadores) {
    const container = document.getElementById('jugadores-container');
    
    if (!container) {
        console.error('Contenedor de jugadores no encontrado');
        return;
    }
    
    const html = jugadores.map(jugador => {
        // Validaciones de datos
        const nombre = jugador.nombre || 'Sin nombre';
        const edad = jugador.edad || 0;
        const posicion = jugador.posicion || 'N/A';
        const general = jugador.general || 0;
        const potencial = jugador.potencial || 0;
        const estadoFisico = jugador.estadoFisico || 0;
        const cansancio = jugador.cansancio || 0;
        const valorMercado = jugador.valorMercado || 0;
        
        const lesionText = jugador.lesion ? 
            `🏥 ${jugador.lesion.nombre || 'Lesión'} (${jugador.lesion.diasRestantes || 0} días)` : '';
        
        return `
            <div class="jugador-card">
                <div class="jugador-header">
                    <div class="jugador-info">
                        <h3>${nombre}</h3>
                        <p>${edad} años</p>
                    </div>
                    <span class="posicion-badge posicion-${posicion}">${posicion}</span>
                </div>
                
                <div class="jugador-stats">
                    <div class="stat-item">
                        <span class="stat-label">General</span>
                        <span class="stat-value">${general}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Potencial</span>
                        <span class="stat-value">${potencial}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Estado Físico</span>
                        <span class="stat-value">${estadoFisico}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Cansancio</span>
                        <span class="stat-value">${cansancio}%</span>
                    </div>
                </div>
                
                <div class="valor-mercado">
                    <span class="label">Valor de Mercado</span>
                    <span class="value">$${valorMercado.toLocaleString()}</span>
                </div>
                
                ${jugador.lesion ? `<div class="lesion-info">${lesionText}</div>` : ''}
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

function mostrarError(mensaje) {
    const container = document.getElementById('jugadores-container');
    if (container) {
        container.innerHTML = `
            <div class="no-data">
                <p>${mensaje}</p>
            </div>
        `;
    }
}

function refreshPlantilla() {
    cargarPlantilla();
}

function goBack() {
    window.history.back();
}
