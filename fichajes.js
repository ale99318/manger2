document.addEventListener('DOMContentLoaded', function() {
    // === DATOS BÁSICOS ===
    const equipoNombre = localStorage.getItem("selectedClub") || "Mi Equipo";
    
    if (!window.jugadores) {
        console.error("No hay datos de jugadores");
        return;
    }
    
    // === CONFIGURACIÓN DE RETIRO ===
    const EDAD_RETIRO_MIN = 35; // Edad mínima para considerar retiro
    const EDAD_RETIRO_MAX = 42; // Edad máxima antes del retiro forzoso
    
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
    
    // === LÓGICA DE RETIRO POR EDAD ===
    function calcularProbabilidadRetiro(edad) {
        if (edad < EDAD_RETIRO_MIN) return 0;
        if (edad >= EDAD_RETIRO_MAX) return 1; // Retiro forzoso
        
        // Probabilidad gradual entre 35-42 años
        const rango = EDAD_RETIRO_MAX - EDAD_RETIRO_MIN;
        const posicionEnRango = edad - EDAD_RETIRO_MIN;
        return (posicionEnRango / rango) * 0.3; // Máximo 30% antes del retiro forzoso
    }
    
    function procesarRetirosJugadores(jugadores) {
        let retirosEsteAño = [];
        
        jugadores.forEach(jugador => {
            if (!jugador.retirado && jugador.edad >= EDAD_RETIRO_MIN) {
                const probabilidad = calcularProbabilidadRetiro(jugador.edad);
                
                if (Math.random() < probabilidad) {
                    jugador.retirado = true;
                    jugador.fechaRetiro = new Date().toISOString().split('T')[0];
                    jugador.club = "Retirado"; // Cambiar club a "Retirado"
                    retirosEsteAño.push(jugador);
                }
            }
        });
        
        return retirosEsteAño;
    }
    
    // === GESTIÓN DE CONTRATOS ===
    function procesarContratos(jugadores) {
        let jugadoresLibres = [];
        
        jugadores.forEach(jugador => {
            if (!jugador.retirado && jugador.contrato) {
                // Reducir años de contrato
                if (jugador.contrato.anos > 0) {
                    jugador.contrato.anos--;
                }
                
                // Si se acabó el contrato, queda libre
                if (jugador.contrato.anos <= 0) {
                    jugador.club = "Libre"; // Agente libre, no retirado
                    jugador.contrato = null;
                    jugadoresLibres.push(jugador);
                }
            }
        });
        
        return jugadoresLibres;
    }
    
    // === ENVEJECIMIENTO CORREGIDO ===
    function envejecerJugadores(dias) {
        let jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
        let huboEnvejecimiento = false;
        
        let diasAcumulados = parseInt(localStorage.getItem("diasAcumuladosEnvejecimiento") || "0");
        diasAcumulados += dias;
        
        if (diasAcumulados >= 365) {
            const añosQuePasan = Math.floor(diasAcumulados / 365);
            diasAcumulados = diasAcumulados % 365;
            
            // 1. ENVEJECER JUGADORES ACTIVOS
            jugadores.forEach(jugador => {
                if (!jugador.retirado) {
                    jugador.edad += añosQuePasan;
                }
            });
            
            // 2. PROCESAR RETIROS POR EDAD
            const retirados = procesarRetirosJugadores(jugadores);
            
            // 3. PROCESAR CONTRATOS (jugadores libres, no retirados)
            const libres = procesarContratos(jugadores);
            
            // 4. GUARDAR CAMBIOS
            localStorage.setItem("jugadores", JSON.stringify(jugadores));
            huboEnvejecimiento = true;
            
            // 5. MOSTRAR RESUMEN
            if (retirados.length > 0) {
                console.log(`🏆 RETIROS DEL AÑO:`);
                retirados.forEach(j => {
                    console.log(`- ${j.nombre} (${j.edad} años) se retiró del fútbol`);
                });
            }
            
            if (libres.length > 0) {
                console.log(`🆓 AGENTES LIBRES:`);
                libres.forEach(j => {
                    console.log(`- ${j.nombre} quedó libre (contrato expirado)`);
                });
            }
        }
        
        localStorage.setItem("diasAcumuladosEnvejecimiento", diasAcumulados.toString());
        return huboEnvejecimiento;
    }
    
    // === CREAR MERCADO CORREGIDO ===
    function crearMercado() {
        const jugadoresActualizados = JSON.parse(localStorage.getItem("jugadores") || "[]");
        
        return jugadoresActualizados
            .filter(j => {
                // Excluir: jugadores de mi equipo y jugadores retirados
                return j.club !== equipoNombre && !j.retirado;
                // INCLUIR: jugadores de otros clubes y agentes libres (club === "Libre")
            })
            .map(jugador => ({
                ...jugador,
                precio: Math.floor(jugador.valor * (0.8 + Math.random() * 0.4))
            }));
    }
    
    // === MOSTRAR JUGADORES ===
    function crearTarjetaJugador(jugador) {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'player-card';
        
        // Determinar el estado del jugador
        let estadoJugador = jugador.club;
        let claseEstado = '';
        
        if (jugador.club === "Libre") {
            estadoJugador = "🆓 Agente Libre";
            claseEstado = 'free-agent';
        } else if (jugador.retirado) {
            estadoJugador = "🏆 Retirado";
            claseEstado = 'retired';
        }
        
        tarjeta.innerHTML = `
            <div class="player-photo">
                <div class="photo-placeholder">👤</div>
            </div>
            <div class="player-details">
                <h3>${jugador.nombre}</h3>
                <p>${jugador.posicion} - <span class="${claseEstado}">${estadoJugador}</span></p>
                <div class="player-rating">
                    <span>OVR: ${jugador.general}</span>
                    <span>Edad: ${jugador.edad}</span>
                </div>
                <div class="transfer-info">
                    <p><strong>${formatearPrecio(jugador.precio)}</strong></p>
                    ${jugador.club === "Libre" ? '<p class="free-tag">Sin costo de traspaso</p>' : ''}
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
        
        // Separar por categorías
        const jugadoresConClub = mercado.filter(j => j.club !== "Libre");
        const agentesLibres = mercado.filter(j => j.club === "Libre");
        
        // Mostrar jugadores con club primero
        jugadoresConClub.forEach(jugador => {
            grid.appendChild(crearTarjetaJugador(jugador));
        });
        
        // Luego mostrar agentes libres
        agentesLibres.forEach(jugador => {
            grid.appendChild(crearTarjetaJugador(jugador));
        });
        
        // Mostrar estadísticas del mercado
        console.log(`🏪 MERCADO ACTUALIZADO:`);
        console.log(`- Jugadores con club: ${jugadoresConClub.length}`);
        console.log(`- Agentes libres: ${agentesLibres.length}`);
        console.log(`- Total disponibles: ${mercado.length}`);
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
        
        // Cuando cambie la fecha, envejecer jugadores y procesar retiros/contratos
        envejecerJugadores(1);
        
        // Actualizar mercado
        mostrarJugadores();
        
        console.log('✅ Mercado actualizado tras cambio de fecha');
    });
    
    console.log(`=== MERCADO ${equipoNombre} ===`);
    console.log(`Presupuesto: ${formatearPrecio(obtenerPresupuesto())}`);
    
    // Mostrar estadísticas iniciales detalladas
    const jugadoresTotal = JSON.parse(localStorage.getItem("jugadores") || "[]");
    const jugadoresRetirados = jugadoresTotal.filter(j => j.retirado).length;
    const jugadoresActivos = jugadoresTotal.filter(j => !j.retirado).length;
    const agentesLibres = jugadoresTotal.filter(j => !j.retirado && j.club === "Libre").length;
    const jugadoresConClub = jugadoresTotal.filter(j => !j.retirado && j.club !== "Libre").length;
    
    console.log(`📊 ESTADÍSTICAS GENERALES:`);
    console.log(`- Total jugadores: ${jugadoresTotal.length}`);
    console.log(`- Jugadores activos: ${jugadoresActivos}`);
    console.log(`  • Con club: ${jugadoresConClub}`);
    console.log(`  • Agentes libres: ${agentesLibres}`);
    console.log(`- Jugadores retirados: ${jugadoresRetirados}`);
});
