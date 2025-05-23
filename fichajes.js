// Sistema simplificado de equipo y transferencias
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
    
    // === GESTIÓN DE PRESUPUESTO ===
    function obtenerPresupuesto() {
        // 1. Finanzas principales (prioritario)
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
    
    // === GESTIÓN DE FECHAS ===
    function obtenerFechaJuego() {
        const fecha = localStorage.getItem("fechaJuego");
        return fecha ? new Date(fecha) : new Date("2025-01-01");
    }
    
    // === SINCRONIZACIÓN DE JUGADORES ===
    function obtenerEstadoJugadores() {
        const jugadoresActualizados = JSON.parse(localStorage.getItem("jugadores") || "[]");
        const historialFichajes = JSON.parse(localStorage.getItem('historialFichajes') || '[]');
        const historialEliminados = JSON.parse(localStorage.getItem('historialEliminados') || '[]');
        const jugadoresVendidos = JSON.parse(localStorage.getItem("jugadoresVendidos") || "[]");
        
        const retirados = new Set();
        const fichados = new Set();
        const libres = new Set();
        
        // Identificar retirados
        jugadoresActualizados.forEach(j => {
            if (j.retirado) retirados.add(j.nombre);
        });
        
        // Identificar fichados (excluir retirados)
        [...historialFichajes.map(f => f.jugador), ...jugadoresVendidos].forEach(nombre => {
            if (!retirados.has(nombre)) fichados.add(nombre);
        });
        
        // Identificar libres por contrato vencido (excluir retirados)
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
    
    // === MERCADO DE TRANSFERENCIAS ===
    function generarDatosTransferencia(jugador, esLibre) {
        const estados = esLibre ? ['libre'] : ['disponible', 'clausula', 'libre'];
        const random = Math.random();
        const estado = esLibre ? 'libre' : 
            (random < 0.6 ? 'disponible' : random < 0.9 ? 'clausula' : 'libre');
        
        const multiplicadores = {
            'disponible': 0.8 + Math.random() * 0.4,  // 80-120%
            'clausula': 1.5 + Math.random() * 0.5,    // 150-200%
            'libre': 0.05 + Math.random() * 0.1       // 5-15%
        };
        
        const precio = Math.floor(jugador.valor * multiplicadores[estado]);
        const bonusFirma = Math.floor(jugador.sueldo * 0.1 * (0.2 + Math.random() * 0.8));
        
        return {
            estado,
            precio,
            bonusFirma,
            costoTotal: precio + bonusFirma
        };
    }
    
    function crearMercado() {
        const { retirados, fichados, libres } = obtenerEstadoJugadores();
        
        return window.jugadores
            .filter(j => {
                if (retirados.has(j.nombre)) return false;
                if (j.club === equipoNombre) return false;
                if (fichados.has(j.nombre) && !libres.has(j.nombre)) return false;
                return true;
            })
            .map(jugador => {
                const esLibre = libres.has(jugador.nombre);
                const transferData = generarDatosTransferencia(jugador, esLibre);
                
                return {
                    ...jugador,
                    ...transferData,
                    esLibre,
                    disponible: true
                };
            });
    }
    
    // === INTERFAZ DE USUARIO ===
    function obtenerDescripcionEstado(estado, esLibre) {
        if (esLibre) return 'Agente libre (Contrato vencido)';
        const descripciones = {
            'disponible': 'Precio negociable',
            'clausula': 'Cláusula de rescisión',
            'libre': 'Agente libre'
        };
        return descripciones[estado] || 'No disponible';
    }
    
    function crearTarjetaJugador(jugador) {
        const tarjeta = document.createElement('div');
        tarjeta.className = `player-card ${jugador.esLibre ? 'jugador-libre' : ''}`;
        tarjeta.innerHTML = `
            <div class="player-photo">
                <div class="photo-placeholder">👤</div>
                ${jugador.esLibre ? '<div class="badge-libre">LIBRE</div>' : ''}
            </div>
            <div class="player-details">
                <h3>${jugador.nombre}</h3>
                <p>${jugador.posicion} - ${jugador.club}</p>
                <div class="player-rating">
                    <span>OVR: ${jugador.general}</span>
                    <span>POT: ${jugador.potencial}</span>
                </div>
                <div class="transfer-info">
                    <p>${obtenerDescripcionEstado(jugador.estado, jugador.esLibre)}</p>
                    <p><strong>${formatearPrecio(jugador.costoTotal)}</strong></p>
                </div>
                <button class="btn-negotiation" data-player-id="${jugador.id}">
                    Negociar
                </button>
            </div>
        `;
        return tarjeta;
    }
    
    function mostrarJugadores(jugadores = mercado) {
        const grid = document.getElementById('playersGrid');
        if (!grid) return;
        
        // Verificar disponibilidad en tiempo real
        const { retirados, fichados, libres } = obtenerEstadoJugadores();
        const disponibles = jugadores.filter(j => {
            if (retirados.has(j.nombre)) return false;
            return !fichados.has(j.nombre) || libres.has(j.nombre);
        });
        
        grid.innerHTML = disponibles.length === 0 ? 
            '<p class="no-players">No hay jugadores disponibles</p>' :
            '';
        
        disponibles.forEach(jugador => {
            grid.appendChild(crearTarjetaJugador(jugador));
        });
        
        // Event listeners para negociación
        grid.querySelectorAll('.btn-negotiation').forEach(btn => {
            btn.addEventListener('click', function() {
                iniciarNegociacion(parseInt(this.dataset.playerId));
            });
        });
    }
    
    // === FILTROS ===
    function aplicarFiltros() {
        const posicion = document.getElementById('positionFilter')?.value;
        const precioMax = parseInt(document.getElementById('priceFilter')?.value || Infinity);
        const club = document.getElementById('clubFilter')?.value;
        
        let filtrados = [...mercado];
        
        if (posicion && posicion !== 'all') {
            filtrados = filtrados.filter(j => j.posicion === posicion);
        }
        if (precioMax < Infinity) {
            filtrados = filtrados.filter(j => j.costoTotal <= precioMax);
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
    
    // === NEGOCIACIÓN ===
    function iniciarNegociacion(jugadorId) {
        const jugador = mercado.find(j => j.id === jugadorId);
        if (!jugador) return;
        
        // Verificar disponibilidad
        const { retirados, fichados, libres } = obtenerEstadoJugadores();
        
        if (retirados.has(jugador.nombre)) {
            alert("Este jugador se ha retirado del fútbol.");
            refrescarSistema();
            return;
        }
        
        if (fichados.has(jugador.nombre) && !libres.has(jugador.nombre)) {
            alert("Este jugador ya no está disponible.");
            refrescarSistema();
            return;
        }
        
        // Preparar datos para negociación
        const jugadorNegociacion = {
            ...jugador,
            fechaJuegoActual: obtenerFechaJuego().toISOString()
        };
        
        localStorage.setItem('jugadorSeleccionado', JSON.stringify(jugadorNegociacion));
        
        // Redirigir según tipo
        const paginas = {
            'disponible': 'negociarclub.html',
            'libre': 'agente-libre.html',
            'clausula': 'clausula-rescision.html'
        };
        
        window.location.href = paginas[jugador.estado] || 'negociarclub.html';
    }
    
    // === INICIALIZACIÓN Y ACTUALIZACIÓN ===
    let mercado = crearMercado();
    let presupuestoActual = actualizarPresupuestoDOM();
    
    // Actualizar elementos DOM iniciales
    const elementoEquipo = document.getElementById('teamName');
    if (elementoEquipo) elementoEquipo.textContent = equipoNombre;
    
    // Configurar filtros y mostrar jugadores
    configurarFiltros();
    mostrarJugadores();
    
    // Log inicial
    console.log(`=== ${equipoNombre} ===`);
    console.log(`Entrenador: ${entrenadorNombre}`);
    console.log(`Presupuesto: ${formatearPrecio(presupuestoActual)}`);
    console.log(`Jugadores disponibles: ${mercado.length}`);
    
    // === OBJETO GLOBAL ===
    window.miEquipoInfo = {
        nombre: equipoNombre,
        entrenador: entrenadorNombre,
        presupuesto: presupuestoActual,
        fechaJuego: obtenerFechaJuego(),
        
        mostrarInfo() {
            console.log(`${this.nombre} | ${formatearPrecio(this.presupuesto)} | ${this.fechaJuego.toLocaleDateString()}`);
        },
        
        actualizarPresupuesto() {
            this.presupuesto = actualizarPresupuestoDOM();
            console.log("🔄 Presupuesto actualizado:", formatearPrecio(this.presupuesto));
            return this.presupuesto;
        }
    };
    
    // === SISTEMA DE ACTUALIZACIÓN ===
    function refrescarSistema() {
        mercado = crearMercado();
        actualizarPresupuestoDOM();
        aplicarFiltros();
        console.log("🔄 Sistema actualizado");
    }
    
    // Escuchar cambios
    const keysToWatch = [
        'jugadores', 'historialFichajes', 'jugadoresVendidos', 
        'historialEliminados', 'finanzasClub', 'historialVentas',
        `presupuesto_${equipoNombre}`
    ];
    
    window.addEventListener('storage', function(e) {
        if (keysToWatch.includes(e.key)) {
            setTimeout(refrescarSistema, 500);
        }
    });
    
    // Escuchar cambios de fecha
    window.addEventListener('fechaCambiada', function(e) {
        window.miEquipoInfo.fechaJuego = e.detail.fecha;
        setTimeout(refrescarSistema, 1000);
    });
    
    // Verificación periódica de presupuesto
    let ultimoPresupuesto = presupuestoActual;
    setInterval(() => {
        const nuevo = obtenerPresupuesto();
        if (nuevo !== ultimoPresupuesto) {
            ultimoPresupuesto = nuevo;
            actualizarPresupuestoDOM();
        }
    }, 3000);
    
    // Funciones globales
    window.refrescarMercadoTransferencias = refrescarSistema;
    window.actualizarPresupuesto = actualizarPresupuestoDOM;
});
