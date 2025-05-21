// Configuración inicial
const dtNombre = localStorage.getItem("coachName") || "Entrenador";
const clubNombre = localStorage.getItem("selectedClub") || "Mi Equipo";

// Obtener datos de clubes desde window.clubes (definido en tu JS de clubes)
let clubes = [];

// Variables globales
let miClub = null;
let miPresupuesto = 0;
let jugadoresDisponibles = [];
let jugadoresFiltrados = [];
let historialTransferencias = JSON.parse(localStorage.getItem('transferHistory')) || [];

// Verificar y obtener datos de clubes
function verificarDatosClubs() {
    if (window.clubes && Array.isArray(window.clubes)) {
        clubes = window.clubes;
        return true;
    }
    
    // Si no están disponibles, usar datos por defecto
    clubes = [
        { nombre: "Alianza Lima", presupuesto: 12000000 },
        { nombre: "Universitario", presupuesto: 11000000 },
        { nombre: "Sporting Cristal", presupuesto: 9500000 },
        { nombre: "Melgar", presupuesto: 8000000 },
        { nombre: "Cienciano", presupuesto: 7500000 }
    ];
    
    console.warn("No se encontraron datos de clubes, usando datos por defecto");
    return false;
}

// Obtener mi club y presupuesto
function inicializarDatos() {
    verificarDatosClubs();
    
    console.log("Club seleccionado:", clubNombre);
    console.log("Clubes disponibles:", clubes.map(c => c.nombre));
    
    miClub = clubes.find(club => club.nombre === clubNombre);
    
    if (miClub) {
        console.log("Mi club encontrado:", miClub);
        // Obtener presupuesto actual (puede haber cambiado por transferencias previas)
        const presupuestoGuardado = localStorage.getItem(`presupuesto_${clubNombre}`);
        miPresupuesto = presupuestoGuardado ? parseInt(presupuestoGuardado) : miClub.presupuesto;
        console.log("Presupuesto inicial:", miPresupuesto);
    } else {
        console.error("Club no encontrado:", clubNombre);
        miPresupuesto = 5000000; // Presupuesto por defecto
    }
    
    actualizarUI();
    generarJugadores();
}

// Actualizar información en la UI
function actualizarUI() {
    const teamNameElement = document.getElementById('teamName');
    const budgetElement = document.getElementById('currentBudget');
    
    if (teamNameElement) {
        teamNameElement.textContent = clubNombre;
    }
    
    if (budgetElement) {
        budgetElement.textContent = formatearPrecio(miPresupuesto);
    }
    
    console.log("UI actualizada - Club:", clubNombre, "Presupuesto:", miPresupuesto);
}

// Generar jugadores ficticios para el mercado
function generarJugadores() {
    const nombres = [
        "Carlos Rodríguez", "Juan Pérez", "Miguel Ángel", "Luis Fernando", "Diego Armando",
        "Roberto Silva", "Fernando López", "Andrés García", "Pablo Martín", "Javier Ruiz",
        "Eduardo Sánchez", "Ricardo Morales", "Alejandro Cruz", "Daniel Herrera", "Mario Vega",
        "Gabriel Torres", "Sebastián Reyes", "Cristian Mendoza", "Óscar Jiménez", "Raúl Castro",
        "Víctor Hugo", "Emilio Vargas", "Francisco Ramos", "Gonzalo Flores", "Adrián Campos",
        "Nicolás Rivera", "Matías Guerrero", "Ignacio Romero", "Facundo Aguilar", "Maximiliano Ortiz",
        "Ángel Moreno", "Bruno Castillo", "César Vásquez", "Damián Rojas", "Esteban Cortés"
    ];
    
    const apellidos = [
        "García", "López", "Martínez", "González", "Rodríguez", "Fernández", "Sánchez", "Pérez",
        "Gómez", "Martín", "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno", "Muñoz",
        "Álvarez", "Romero", "Alonso", "Gutiérrez", "Navarro", "Torres", "Domínguez", "Vázquez"
    ];
    
    const posiciones = [
        { nombre: "Portero", color: "#e74c3c" },
        { nombre: "Defensa", color: "#3498db" },
        { nombre: "Centrocampista", color: "#f39c12" },
        { nombre: "Delantero", color: "#27ae60" }
    ];
    
    jugadoresDisponibles = [];
    let contadorId = 1;
    
    // Generar jugadores para cada club (excepto el mío)
    clubes.forEach(club => {
        if (club.nombre !== clubNombre) {
            const numJugadores = Math.floor(Math.random() * 4) + 3; // 3-6 jugadores por club
            
            for (let i = 0; i < numJugadores; i++) {
                const posicion = posiciones[Math.floor(Math.random() * posiciones.length)];
                const overall = Math.floor(Math.random() * 25) + 70; // Overall entre 70-94
                const precio = calcularPrecioJugador(overall, club.presupuesto);
                
                const nombre = nombres[Math.floor(Math.random() * nombres.length)];
                const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
                
                const jugador = {
                    id: contadorId++,
                    nombre: `${nombre} ${apellido}`,
                    posicion: posicion.nombre,
                    colorPosicion: posicion.color,
                    club: club.nombre,
                    overall: overall,
                    precio: precio,
                    edad: Math.floor(Math.random() * 12) + 18, // Edad entre 18-29
                    velocidad: Math.floor(Math.random() * 30) + 65,
                    tiro: Math.floor(Math.random() * 30) + 65,
                    pase: Math.floor(Math.random() * 30) + 65,
                    defensa: Math.floor(Math.random() * 30) + 65,
                    fisico: Math.floor(Math.random() * 30) + 65
                };
                
                // Ajustar stats según posición
                switch(posicion.nombre) {
                    case "Portero":
                        jugador.defensa += 15;
                        jugador.fisico += 10;
                        break;
                    case "Defensa":
                        jugador.defensa += 12;
                        jugador.fisico += 8;
                        break;
                    case "Centrocampista":
                        jugador.pase += 12;
                        jugador.velocidad += 5;
                        break;
                    case "Delantero":
                        jugador.tiro += 15;
                        jugador.velocidad += 10;
                        break;
                }
                
                // Asegurar que las stats no excedan 99
                jugador.velocidad = Math.min(99, jugador.velocidad);
                jugador.tiro = Math.min(99, jugador.tiro);
                jugador.pase = Math.min(99, jugador.pase);
                jugador.defensa = Math.min(99, jugador.defensa);
                jugador.fisico = Math.min(99, jugador.fisico);
                
                jugadoresDisponibles.push(jugador);
            }
        }
    });
    
    console.log("Jugadores generados:", jugadoresDisponibles.length);
    jugadoresFiltrados = [...jugadoresDisponibles];
    llenarFiltrosClubes();
    mostrarJugadores();
}

// Calcular precio basado en overall y presupuesto del club
function calcularPrecioJugador(overall, presupuestoClub) {
    let precioBase = 0;
    
    if (overall >= 90) precioBase = 8000000;
    else if (overall >= 85) precioBase = 5000000;
    else if (overall >= 80) precioBase = 3000000;
    else if (overall >= 75) precioBase = 1500000;
    else if (overall >= 70) precioBase = 800000;
    else precioBase = 400000;
    
    // Ajustar precio según presupuesto del club
    const factorClub = Math.min(presupuestoClub / 8000000, 1.5); // Normalizar con máximo 1.5
    precioBase *= (0.7 + factorClub * 0.6); // Entre 70% y 130% del precio base
    
    // Agregar variabilidad aleatoria
    const variacion = 0.8 + Math.random() * 0.4; // Entre 80% y 120%
    precioBase *= variacion;
    
    return Math.floor(precioBase / 50000) * 50000; // Redondear a múltiplos de 50k
}

// Llenar filtro de clubes
function llenarFiltrosClubes() {
    const clubFilter = document.getElementById('clubFilter');
    if (!clubFilter) return;
    
    const clubesConJugadores = [...new Set(jugadoresDisponibles.map(j => j.club))].sort();
    
    clubFilter.innerHTML = '<option value="all">Todos los clubes</option>';
    clubesConJugadores.forEach(club => {
        const option = document.createElement('option');
        option.value = club;
        option.textContent = club;
        clubFilter.appendChild(option);
    });
}

// Mostrar jugadores en la grid
function mostrarJugadores() {
    const grid = document.getElementById('playersGrid');
    if (!grid) return;
    
    if (jugadoresFiltrados.length === 0) {
        grid.innerHTML = '<div class="no-players">No hay jugadores disponibles con los filtros seleccionados</div>';
        return;
    }
    
    grid.innerHTML = jugadoresFiltrados.map(jugador => `
        <div class="player-card">
            <div class="player-header">
                <img src="/api/placeholder/60/60" alt="${jugador.nombre}" class="player-photo">
                <div class="player-basic-info">
                    <h3>${jugador.nombre}</h3>
                    <span class="player-position" style="background-color: ${jugador.colorPosicion}">
                        ${jugador.posicion}
                    </span>
                </div>
            </div>
            
            <div class="player-stats">
                <div class="stat-item">
                    <span class="stat-label">Edad:</span>
                    <span class="stat-value">${jugador.edad} años</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Velocidad:</span>
                    <span class="stat-value">${jugador.velocidad}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Tiro:</span>
                    <span class="stat-value">${jugador.tiro}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Pase:</span>
                    <span class="stat-value">${jugador.pase}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Defensa:</span>
                    <span class="stat-value">${jugador.defensa}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Físico:</span>
                    <span class="stat-value">${jugador.fisico}</span>
                </div>
            </div>
            
            <div class="overall-rating">
                Overall: ${jugador.overall}
            </div>
            
            <div class="player-club">
                Club: ${jugador.club}
            </div>
            
            <div class="transfer-info">
                <span class="player-price">${formatearPrecio(jugador.precio)}</span>
                <button class="buy-btn" onclick="mostrarModalTransferencia(${jugador.id})" 
                        ${jugador.precio > miPresupuesto ? 'disabled' : ''}>
                    ${jugador.precio > miPresupuesto ? 'Sin presupuesto' : 'Comprar'}
                </button>
            </div>
        </div>
    `).join('');
}

// Formatear precio
function formatearPrecio(precio) {
    if (precio >= 1000000) {
        return `$${(precio / 1000000).toFixed(1)}M`;
    } else if (precio >= 1000) {
        return `$${(precio / 1000).toFixed(0)}K`;
    } else {
        return `$${precio}`;
    }
}

// Mostrar modal de transferencia
function mostrarModalTransferencia(jugadorId) {
    const jugador = jugadoresDisponibles.find(j => j.id === jugadorId);
    if (!jugador) return;
    
    // Llenar datos del modal
    const modalElements = {
        modalPlayerName: document.getElementById('modalPlayerName'),
        modalPlayerPosition: document.getElementById('modalPlayerPosition'),
        modalPlayerClub: document.getElementById('modalPlayerClub'),
        modalPlayerOverall: document.getElementById('modalPlayerOverall'),
        modalTransferPrice: document.getElementById('modalTransferPrice'),
        modalBudgetAfter: document.getElementById('modalBudgetAfter')
    };
    
    if (modalElements.modalPlayerName) modalElements.modalPlayerName.textContent = jugador.nombre;
    if (modalElements.modalPlayerPosition) modalElements.modalPlayerPosition.textContent = jugador.posicion;
    if (modalElements.modalPlayerClub) modalElements.modalPlayerClub.textContent = `Club: ${jugador.club}`;
    if (modalElements.modalPlayerOverall) modalElements.modalPlayerOverall.textContent = jugador.overall;
    if (modalElements.modalTransferPrice) modalElements.modalTransferPrice.textContent = formatearPrecio(jugador.precio);
    if (modalElements.modalBudgetAfter) modalElements.modalBudgetAfter.textContent = formatearPrecio(miPresupuesto - jugador.precio);
    
    // Configurar botón de confirmación
    const confirmBtn = document.getElementById('confirmTransfer');
    if (confirmBtn) {
        confirmBtn.onclick = () => confirmarTransferencia(jugadorId);
    }
    
    // Mostrar modal
    const modal = document.getElementById('transferModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Confirmar transferencia
function confirmarTransferencia(jugadorId) {
    const jugador = jugadoresDisponibles.find(j => j.id === jugadorId);
    if (!jugador || jugador.precio > miPresupuesto) return;
    
    // Actualizar presupuesto
    miPresupuesto -= jugador.precio;
    localStorage.setItem(`presupuesto_${clubNombre}`, miPresupuesto.toString());
    
    // Agregar al historial
    const transferencia = {
        jugador: jugador.nombre,
        precio: jugador.precio,
        clubOrigen: jugador.club,
        fecha: new Date().toLocaleDateString('es-ES')
    };
    
    historialTransferencias.unshift(transferencia);
    if (historialTransferencias.length > 10) historialTransferencias.pop();
    localStorage.setItem('transferHistory', JSON.stringify(historialTransferencias));
    
    // Remover jugador del mercado
    jugadoresDisponibles = jugadoresDisponibles.filter(j => j.id !== jugadorId);
    aplicarFiltros();
    
    // Actualizar UI
    actualizarUI();
    mostrarHistorialTransferencias();
    cerrarModal();
    
    // Mostrar mensaje de éxito
    alert(`¡Transferencia exitosa! ${jugador.nombre} se ha unido a ${clubNombre} por ${formatearPrecio(jugador.precio)}`);
}

// Cerrar modal
function cerrarModal() {
    const modal = document.getElementById('transferModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Mostrar historial de transferencias
function mostrarHistorialTransferencias() {
    const historyDiv = document.getElementById('transferHistory');
    if (!historyDiv) return;
    
    if (historialTransferencias.length === 0) {
        historyDiv.innerHTML = '<div class="no-players">No hay transferencias realizadas</div>';
        return;
    }
    
    historyDiv.innerHTML = historialTransferencias.map(transfer => `
        <div class="transfer-item">
            <div>
                <div class="transfer-player">${transfer.jugador}</div>
                <div style="font-size: 0.8rem; color: #7f8c8d;">desde ${transfer.clubOrigen}</div>
            </div>
            <div style="text-align: right;">
                <div class="transfer-price">${formatearPrecio(transfer.precio)}</div>
                <div style="font-size: 0.8rem; color: #7f8c8d;">${transfer.fecha}</div>
            </div>
        </div>
    `).join('');
}

// Aplicar filtros
function aplicarFiltros() {
    const positionFilter = document.getElementById('positionFilter');
    const priceFilter = document.getElementById('priceFilter');
    const clubFilter = document.getElementById('clubFilter');
    
    if (!positionFilter || !priceFilter || !clubFilter) return;
    
    const positionValue = positionFilter.value;
    const maxPrice = parseInt(priceFilter.value);
    const clubValue = clubFilter.value;
    
    jugadoresFiltrados = jugadoresDisponibles.filter(jugador => {
        const matchPosition = positionValue === 'all' || jugador.posicion === positionValue;
        const matchPrice = jugador.precio <= maxPrice;
        const matchClub = clubValue === 'all' || jugador.club === clubValue;
        
        return matchPosition && matchPrice && matchClub;
    });
    
    mostrarJugadores();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM cargado, inicializando mercado de transferencias...");
    
    // Esperar un poco para asegurar que window.clubes esté disponible
    setTimeout(() => {
        inicializarDatos();
        mostrarHistorialTransferencias();
        
        // Configurar filtros
        const positionFilter = document.getElementById('positionFilter');
        const clubFilter = document.getElementById('clubFilter');
        const priceFilter = document.getElementById('priceFilter');
        const priceValue = document.getElementById('priceValue');
        
        if (positionFilter) positionFilter.addEventListener('change', aplicarFiltros);
        if (clubFilter) clubFilter.addEventListener('change', aplicarFiltros);
        
        // Filtro de precio
        if (priceFilter && priceValue) {
            priceFilter.addEventListener('input', function() {
                priceValue.textContent = formatearPrecio(parseInt(this.value));
                aplicarFiltros();
            });
            
            // Inicializar valor del precio
            priceValue.textContent = formatearPrecio(parseInt(priceFilter.value));
        }
        
        // Modal
        const closeBtn = document.querySelector('.close');
        const cancelBtn = document.getElementById('cancelTransfer');
        
        if (closeBtn) closeBtn.addEventListener('click', cerrarModal);
        if (cancelBtn) cancelBtn.addEventListener('click', cerrarModal);
        
        // Cerrar modal al hacer clic fuera
        window.addEventListener('click', function(event) {
            const modal = document.getElementById('transferModal');
            if (event.target === modal) {
                cerrarModal();
            }
        });
    }, 100);
});

// Exponer funciones globalmente para uso externo
window.transferMarket = {
    getMiPresupuesto: () => miPresupuesto,
    actualizarPresupuesto: (nuevoPresupuesto) => {
        miPresupuesto = nuevoPresupuesto;
        localStorage.setItem(`presupuesto_${clubNombre}`, miPresupuesto.toString());
        actualizarUI();
    },
    getMiClub: () => clubNombre,
    getHistorialTransferencias: () => historialTransferencias,
    reiniciarMercado: () => {
        jugadoresDisponibles = [];
        jugadoresFiltrados = [];
        generarJugadores();
    }
};
