// Mercado simple de transferencias - Solo mostrar jugadores y presupuesto
document.addEventListener('DOMContentLoaded', function() {
    // === CONFIGURACIÓN INICIAL ===
    const equipoNombre = localStorage.getItem("selectedClub") || "Mi Equipo";
    const entrenadorNombre = localStorage.getItem("coachName") || "Entrenador";
    
    // Verificar datos básicos
    if (!window.clubes || !window.jugadores) {
        console.error("❌ Faltan datos de clubes o jugadores");
        return;
    }
    
    const miEquipo = window.clubes.find(club => club.nombre === equipoNombre);
    if (!miEquipo) {
        console.error(`❌ No se encontró el equipo: ${equipoNombre}`);
        return;
    }
    
    // === SISTEMA DE RETIROS ===
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
    
    // === GESTIÓN DE PRESUPUESTO ===
    function obtenerPresupuesto() {
        // 1. Finanzas principales
        const finanzas = JSON.parse(localStorage.getItem("finanzasClub") || "{}");
        if (finanzas.saldo !== undefined) return Math.max(0, finanzas.saldo);
        
        // 2. Presupuesto específico
        const presupuestoEspecifico = localStorage.getItem(`presupuesto_${equipoNombre}`);
        if (presupuestoEspecifico) return Math.max(0, parseInt(presupuestoEspecifico));
        
        // 3. Calcular desde transacciones
        const fichajes = JSON.parse(localStorage.getItem('historialFichajes') || '[]');
        const ventas = JSON.parse(localStorage.getItem('historialVentas') || '[]');
        
        const gastos = fichajes
            .filter(f => f.equipoDestino === equipoNombre || f.equipo === equipoNombre)
            .reduce((sum, f) => sum + (f.precio || 0) + (f.bonusFirma || 0), 0);
        
        const ingresos = ventas
            .filter(v => v.equipoVendedor === equipoNombre || v.equipo === equipoNombre)
            .reduce((sum, v) => sum + (v.precio || 0), 0);
        
        return Math.max(0, miEquipo.presupuesto - gastos + ingresos);
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
    
    // === SINCRONIZACIÓN DE JUGADORES ===
    function obtenerJugadoresNoDisponibles() {
        // Primero evaluar retiros
        evaluarRetirosGenerales();
        
        const jugadoresActualizados = JSON.parse(localStorage.getItem("jugadores") || "[]");
        const historialFichajes = JSON.parse(localStorage.getItem('historialFichajes') || '[]');
        const historialEliminados = JSON.parse(localStorage.getItem('historialEliminados') || '[]');
        const jugadoresVendidos = JSON.parse(localStorage.getItem("jugadoresVendidos") || "[]");
        
        const retirados = new Set();
        const fichados = new Set();
        const libres = new Set();
        
        // Jugadores retirados
        jugadoresActualizados.forEach(j => {
            if (j.retirado) retirados.add(j.nombre);
        });
        
        // Jugadores ya fichados
        [...historialFichajes.map(f => f.jugador), ...jugadoresVendidos].forEach(nombre => {
            if (!retirados.has(nombre)) fichados.add(nombre);
        });
        
        // Jugadores que no renovaron (quedaron libres)
        historialEliminados.forEach(e => {
            if (e.motivo === "Contrato vencido" && !retirados.has(e.nombre)) {
                libres.add(e.nombre);
            }
        });
        
        // Jugadores que cambiaron de club
        jugadoresActualizados.forEach(j => {
            if (!j.retirado) {
                const original = window.jugadores.find(orig => orig.nombre === j.nombre);
                if (original && original.club !== j.club) fichados.add(j.nombre);
            }
        });
        
        return { retirados, fichados, libres };
    }
    
    // === MERCADO SIMPLE ===
    function generarEstadoTransferencia(jugador, esLibre) {
        if (esLibre) return 'libre';
        
        const random = Math.random();
        if (random < 0.6) return 'disponible';     // 60% - Negociable
        if (random < 0.9) return 'clausula';      // 30% - Cláusula
        return 'libre';                            // 10% - Libre
    }
    
    function calcularPrecio(jugador, estado) {
        const multiplicadores = {
            'disponible': 0.8 + Math.random() * 0.4,  // 80-120%
            'clausula': 1.5 + Math.random() * 0.5,    // 150-200%
            'libre': 0.05 + Math.random() * 0.1       // 5-15%
        };
        return Math.floor(jugador.valor * multiplicadores[estado]);
    }
    
    function crearMercado() {
        const { retirados, fichados, libres } = obtenerJugadoresNoDisponibles();
        
        return window.jugadores
            .filter(j => {
                if (retirados.has(j.nombre)) return false;
                if (j.club === equipoNombre) return false;
                if (fichados.has(j.nombre) && !libres.has(j.nombre)) return false;
                return true;
            })
            .map(jugador => {
                const esLibre = libres.has(jugador.nombre);
                const estado = generarEstadoTransferencia(jugador, esLibre);
                const precio = calcularPrecio(jugador, estado);
                
                return {
                    ...jugador,
                    estado,
                    precio,
                    esLibre
                };
            });
    }
    
    // === MOSTRAR JUGADORES ===
    function obtenerDescripcion(estado, esLibre) {
        if (esLibre) return 'No renovó - Agente libre';
        
        const descripciones = {
            'disponible': 'Precio negociable',
            'clausula': 'Cláusula de rescisión',
            'libre': 'Agente libre'
        };
        return descripciones[estado];
    }
    
    function crearTarjetaJugador(jugador) {
        const tarjeta = document.createElement('div');
        tarjeta.className = `player-card ${jugador.esLibre ? 'no-renovo' : ''}`;
        tarjeta.innerHTML = `
            <div class="player-photo">
                <div class="photo-placeholder">👤</div>
                ${jugador.esLibre ? '<div class="badge-libre">NO RENOVÓ</div>' : ''}
            </div>
            <div class="player-details">
                <h3>${jugador.nombre}</h3>
                <p>${jugador.posicion} - ${jugador.club}</p>
                <div class="player-rating">
                    <span>OVR: ${jugador.general}</span>
                    <span>POT: ${jugador.potencial}</span>
                </div>
                <div class="transfer-info">
                    <p>${obtenerDescripcion(jugador.estado, jugador.esLibre)}</p>
                    <p><strong>${formatearPrecio(jugador.precio)}</strong></p>
                </div>
                <button class="btn-transfer" data-player-id="${jugador.id}">
                    ${jugador.estado === 'disponible' ? 'Negociar con Club' : 'Contratar Directo'}
                </button>
            </div>
        `;
        return tarjeta;
    }
    
    function mostrarJugadores(jugadores = mercado) {
        const grid = document.getElementById('playersGrid');
        if (!grid) return;
        
        // Verificar disponibilidad en tiempo real
        const { retirados, fichados, libres } = obtenerJugadoresNoDisponibles();
        const disponibles = jugadores.filter(j => {
            if (retirados.has(j.nombre)) return false;
            return !fichados.has(j.nombre) || libres.has(j.nombre);
        });
        
        grid.innerHTML = disponibles.length === 0 ? 
            '<p class="no-players">No hay jugadores disponibles</p>' : '';
        
        disponibles.forEach(jugador => {
            grid.appendChild(crearTarjetaJugador(jugador));
        });
        
        // Event listeners
        grid.querySelectorAll('.btn-transfer').forEach(btn => {
            btn.addEventListener('click', function() {
                redirigirSegunTipo(parseInt(this.dataset.playerId));
            });
        });
    }
    
    // === REDIRECCIÓN SEGÚN TIPO ===
    function redirigirSegunTipo(jugadorId) {
        const jugador = mercado.find(j => j.id === jugadorId);
        if (!jugador) return;
        
        // Verificar que siga disponible
        const { retirados, fichados, libres } = obtenerJugadoresNoDisponibles();
        
        if (retirados.has(jugador.nombre)) {
            alert("Este jugador se ha retirado del fútbol.");
            refrescarMercado();
            return;
        }
        
        if (fichados.has(jugador.nombre) && !libres.has(jugador.nombre)) {
            alert("Este jugador ya no está disponible.");
            refrescarMercado();
            return;
        }
        
        // Guardar datos del jugador
        localStorage.setItem('jugadorSeleccionado', JSON.stringify(jugador));
        
        // Redirigir según el tipo
        if (jugador.estado === 'disponible') {
            // Precio negociable → Negociar con el club
            window.location.href = 'negociarclub.html';
        } else {
            // Cláusula o agente libre → Contrato directo
            window.location.href = 'contrato.html';
        }
    }
    
    // === FILTROS SIMPLES ===
    function aplicarFiltros() {
        const posicion = document.getElementById('positionFilter')?.value;
        const precioMax = parseInt(document.getElementById('priceFilter')?.value || Infinity);
        const club = document.getElementById('clubFilter')?.value;
        
        let filtrados = [...mercado];
        
        if (posicion && posicion !== 'all') {
            filtrados = filtrados.filter(j => j.posicion === posicion);
        }
        if (precioMax < Infinity) {
            filtrados = filtrados.filter(j => j.precio <= precioMax);
        }
        if (club && club !== 'all') {
            filtrados = filtrados.filter(j => j.club === club);
        }
        
        mostrarJugadores(filtrados);
    }
    
    function configurarFiltros() {
        // Llenar filtro de clubes
        const clubFilter = document.getElementById('clubFilter');
        if (clubFilter) {
            const clubes = [...new Set(mercado.map(j => j.club))];
            clubes.forEach(club => {
                const option = document.createElement('option');
                option.value = option.textContent = club;
                clubFilter.appendChild(option);
            });
        }
        
        // Event listeners
        ['positionFilter', 'clubFilter'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', aplicarFiltros);
        });
        
        const priceFilter = document.getElementById('priceFilter');
        if (priceFilter) {
            priceFilter.addEventListener('input', function() {
                const priceValue = document.getElementById('priceValue');
                if (priceValue) priceValue.textContent = formatearPrecio(parseInt(this.value));
                aplicarFiltros();
            });
        }
    }
    
    // === INICIALIZACIÓN ===
    let mercado = crearMercado();
    let presupuestoActual = actualizarPresupuestoDOM();
    
    // Actualizar nombre del equipo
    const elementoEquipo = document.getElementById('teamName');
    if (elementoEquipo) elementoEquipo.textContent = equipoNombre;
    
    // Configurar y mostrar
    configurarFiltros();
    mostrarJugadores();
    
    console.log(`=== MERCADO ${equipoNombre} ===`);
    console.log(`Presupuesto: ${formatearPrecio(presupuestoActual)}`);
    console.log(`Jugadores disponibles: ${mercado.length}`);
    
    // === SISTEMA DE ACTUALIZACIÓN ===
    function refrescarMercado() {
        mercado = crearMercado();
        actualizarPresupuestoDOM();
        aplicarFiltros();
        console.log("🔄 Mercado actualizado");
    }
    
    // Escuchar cambios importantes
    const keysToWatch = [
        'jugadores', 'historialFichajes', 'jugadoresVendidos', 
        'historialEliminados', 'finanzasClub', 'historialVentas',
        `presupuesto_${equipoNombre}`
    ];
    
    window.addEventListener('storage', function(e) {
        if (keysToWatch.includes(e.key)) {
            setTimeout(refrescarMercado, 500);
        }
    });
    
    // Verificación periódica del presupuesto
    setInterval(() => {
        const nuevo = obtenerPresupuesto();
        if (nuevo !== presupuestoActual) {
            presupuestoActual = nuevo;
            actualizarPresupuestoDOM();
        }
    }, 3000);
    
    // Funciones globales
    window.refrescarMercadoTransferencias = refrescarMercado;
    window.actualizarPresupuesto = actualizarPresupuestoDOM;
    window.evaluarRetirosGenerales = evaluarRetirosGenerales;
    window.obtenerJugadoresRetirados = obtenerJugadoresRetirados;
    window.obtenerJugadoresActivos = obtenerJugadoresActivos;
});
