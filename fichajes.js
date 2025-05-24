document.addEventListener('DOMContentLoaded', function() {
    // === DATOS BÁSICOS ===
    const equipoNombre = localStorage.getItem("selectedClub") || "Mi Equipo";
    
    if (!window.jugadores) {
        console.error("No hay datos de jugadores");
        return;
    }
    
    // === OBTENER PRESUPUESTO ===
    function obtenerPresupuesto() {
        const finanzas = JSON.parse(localStorage.getItem("finanzasClub") || "{}");
        if (finanzas.saldo !== undefined) return Math.max(0, finanzas.saldo);
        
        const presupuestoEspecifico = localStorage.getItem(`presupuesto_${equipoNombre}`);
        if (presupuestoEspecifico) return Math.max(0, parseInt(presupuestoEspecifico));
        
        return 100000000; // Presupuesto por defecto 100M
    }
    
    function formatearPrecio(precio) {
        if (precio >= 1000000) return `$${(precio / 1000000).toFixed(1)}M`;
        if (precio >= 1000) return `$${(precio / 1000).toFixed(0)}K`;
        return `$${precio}`;
    }
    
    function actualizarPresupuestoDOM() {
        const presupuesto = obtenerPresupuesto();
        const elemento = document.getElementById('currentBudget');
        if (elemento) elemento.textContent = formatearPrecio(presupuesto);
        return presupuesto;
    }
    
    // === ENVEJECIMIENTO ===
    function envejecerJugadores(dias) {
        let jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
        let huboEnvejecimiento = false;
        
        let diasAcumulados = parseInt(localStorage.getItem("diasAcumuladosEnvejecimiento") || "0");
        diasAcumulados += dias;
        
        if (diasAcumulados >= 365) {
            const añosQuePasan = Math.floor(diasAcumulados / 365);
            diasAcumulados = diasAcumulados % 365;
            
            jugadores.forEach(jugador => {
                if (!jugador.retirado) { // Solo envejecer jugadores activos
                    jugador.edad += añosQuePasan;
                }
            });
            
            localStorage.setItem("jugadores", JSON.stringify(jugadores));
            huboEnvejecimiento = true;
        }
        
        localStorage.setItem("diasAcumuladosEnvejecimiento", diasAcumulados.toString());
        return huboEnvejecimiento;
    }
    
    // === CREAR MERCADO (CORREGIDO) ===
    function crearMercado() {
        const jugadoresActualizados = JSON.parse(localStorage.getItem("jugadores") || "[]");
        
        return jugadoresActualizados
            .filter(j => j.club !== equipoNombre && !j.retirado) // CORRECCIÓN: Excluir retirados
            .map(jugador => ({
                ...jugador,
                precio: Math.floor(jugador.valor * (0.8 + Math.random() * 0.4))
            }));
    }
    
    // === MOSTRAR JUGADORES ===
    function crearTarjetaJugador(jugador) {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'player-card';
        tarjeta.innerHTML = `
            <div class="player-photo">
                <div class="photo-placeholder">👤</div>
            </div>
            <div class="player-details">
                <h3>${jugador.nombre}</h3>
                <p>${jugador.posicion} - ${jugador.club}</p>
                <div class="player-rating">
                    <span>OVR: ${jugador.general}</span>
                    <span>Edad: ${jugador.edad}</span>
                </div>
                <div class="transfer-info">
                    <p><strong>${formatearPrecio(jugador.precio)}</strong></p>
                </div>
            </div>
        `;
        return tarjeta;
    }
    
    function mostrarJugadores() {
        const grid = document.getElementById('playersGrid');
        if (!grid) return;
        
        const mercado = crearMercado();
        grid.innerHTML = '';
        
        if (mercado.length === 0) {
            grid.innerHTML = '<p class="no-players">No hay jugadores disponibles</p>';
            return;
        }
        
        mercado.forEach(jugador => {
            grid.appendChild(crearTarjetaJugador(jugador));
        });
        
        // Mostrar estadísticas del mercado
        console.log(`🏪 MERCADO ACTUALIZADO:`);
        console.log(`- Jugadores disponibles: ${mercado.length}`);
        console.log(`- Jugadores retirados filtrados correctamente`);
    }
    
    // === INICIALIZACIÓN ===
    actualizarPresupuestoDOM();
    
    // Actualizar nombre del equipo
    const elementoEquipo = document.getElementById('teamName');
    if (elementoEquipo) elementoEquipo.textContent = equipoNombre;
    
    // Mostrar jugadores
    mostrarJugadores();
    
    // === ESCUCHAR CAMBIOS DE FECHA ===
    window.addEventListener('fechaCambiada', function() {
        console.log('📡 Evento fechaCambiada recibido en mercado');
        
        // Cuando cambie la fecha, envejecer jugadores y actualizar mercado
        envejecerJugadores(1);
        
        // Actualizar mercado (esto automáticamente excluirá jugadores retirados)
        mostrarJugadores();
        
        console.log('✅ Mercado actualizado tras cambio de fecha');
    });
    
    console.log(`=== MERCADO ${equipoNombre} ===`);
    console.log(`Presupuesto: ${formatearPrecio(obtenerPresupuesto())}`);
    
    // Mostrar estadísticas iniciales
    const jugadoresTotal = JSON.parse(localStorage.getItem("jugadores") || "[]");
    const jugadoresRetirados = jugadoresTotal.filter(j => j.retirado).length;
    const jugadoresActivos = jugadoresTotal.filter(j => !j.retirado).length;
    
    console.log(`📊 ESTADÍSTICAS GENERALES:`);
    console.log(`- Total jugadores: ${jugadoresTotal.length}`);
    console.log(`- Jugadores activos: ${jugadoresActivos}`);
    console.log(`- Jugadores retirados: ${jugadoresRetirados}`);
});
