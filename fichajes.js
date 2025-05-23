// Sistema simple para mostrar equipo y presupuesto + Sistema de transferencias SINCRONIZADO CON CALENDARIO
document.addEventListener('DOMContentLoaded', function() {
    // Obtener datos del localStorage
    const equipoNombre = localStorage.getItem("selectedClub") || "Mi Equipo";
    const entrenadorNombre = localStorage.getItem("coachName") || "Entrenador";
    
    // Obtener clubes desde window.clubes (debe estar definido en otro JS)
    let clubes = [];
    
    if (window.clubes && Array.isArray(window.clubes)) {
        clubes = window.clubes;
        console.log("✓ Datos de clubes cargados correctamente");
    } else {
        console.error("❌ No se encontraron datos de clubes en window.clubes");
        return;
    }
    
    // Encontrar mi equipo
    const miEquipo = clubes.find(club => club.nombre === equipoNombre);
    
    if (!miEquipo) {
        console.error(`❌ No se encontró el equipo: ${equipoNombre}`);
        console.log("Clubes disponibles:", clubes.map(c => c.nombre));
        return;
    }
    
    // **FUNCIÓN NUEVA: Sincronizar presupuesto con compras**
    function sincronizarPresupuesto() {
        const finanzasGuardadas = localStorage.getItem("finanzasClub");
        let presupuestoActual;
        
        if (finanzasGuardadas) {
            const finanzas = JSON.parse(finanzasGuardadas);
            presupuestoActual = finanzas.saldo;
        } else {
            // Si no hay finanzas guardadas, usar presupuesto original
            const presupuestoGuardado = localStorage.getItem(`presupuesto_${equipoNombre}`);
            presupuestoActual = presupuestoGuardado ? parseInt(presupuestoGuardado) : miEquipo.presupuesto;
        }
        
        return presupuestoActual;
    }
    
    // Obtener presupuesto sincronizado
    const presupuestoActual = sincronizarPresupuesto();
    
    // **NUEVA FUNCIÓN: Obtener fecha del juego**
    function obtenerFechaJuego() {
        let fechaJuego = localStorage.getItem("fechaJuego");
        
        if (!fechaJuego) {
            // Si no existe, inicializar con fecha por defecto
            const fechaInicio = new Date("2025-01-01");
            localStorage.setItem("fechaJuego", fechaInicio.toISOString());
            return fechaInicio;
        }
        
        return new Date(fechaJuego);
    }
    
    // Función para formatear el precio
    function formatearPrecio(precio) {
        if (precio >= 1000000) {
            return `$${(precio / 1000000).toFixed(1)}M`;
        } else if (precio >= 1000) {
            return `$${(precio / 1000).toFixed(0)}K`;
        } else {
            return `$${precio}`;
        }
    }
    
    // Mostrar información en consola
    console.log("=== INFORMACIÓN DEL EQUIPO ===");
    console.log(`Entrenador: ${entrenadorNombre}`);
    console.log(`Equipo: ${equipoNombre}`);
    console.log(`Presupuesto: ${formatearPrecio(presupuestoActual)}`);
    console.log(`Fecha del juego: ${obtenerFechaJuego().toLocaleDateString()}`);
    console.log("===============================");
    
    // Si existen elementos en el DOM, actualizar
    const elementoEquipo = document.getElementById('teamName');
    const elementoPresupuesto = document.getElementById('currentBudget');
    
    if (elementoEquipo) {
        elementoEquipo.textContent = equipoNombre;
    }
    
    if (elementoPresupuesto) {
        elementoPresupuesto.textContent = formatearPrecio(presupuestoActual);
    }
    
    // Crear objeto global para acceder a los datos
    window.miEquipoInfo = {
        nombre: equipoNombre,
        entrenador: entrenadorNombre,
        presupuesto: presupuestoActual,
        presupuestoFormateado: formatearPrecio(presupuestoActual),
        fechaJuego: obtenerFechaJuego(),
        
        // Método para mostrar información
        mostrarInfo: function() {
            console.log(`Equipo: ${this.nombre} | Presupuesto: ${this.presupuestoFormateado} | Fecha: ${this.fechaJuego.toLocaleDateString()}`);
        },
        
        // **MÉTODO NUEVO: Actualizar presupuesto**
        actualizarPresupuesto: function() {
            this.presupuesto = sincronizarPresupuesto();
            this.presupuestoFormateado = formatearPrecio(this.presupuesto);
            
            if (elementoPresupuesto) {
                elementoPresupuesto.textContent = this.presupuestoFormateado;
            }
        }
    };
    
    // ========== SISTEMA DE TRANSFERENCIAS SINCRONIZADO ==========
    
    // Verificar que existan los datos de jugadores
    if (!window.jugadores || !Array.isArray(window.jugadores)) {
        console.log("⚠️ No se encontraron datos de jugadores - Sistema de transferencias no disponible");
        return;
    }

    // **FUNCIÓN MODIFICADA: Sincronizar jugadores contratados y contratos vencidos**
    function sincronizarJugadoresContratados() {
        const fechaActualJuego = obtenerFechaJuego();
        
        // Obtener jugadores actualizados del localStorage
        const jugadoresActualizados = JSON.parse(localStorage.getItem("jugadores") || "[]");
        const historialFichajes = JSON.parse(localStorage.getItem('historialFichajes') || '[]');
        const historialEliminados = JSON.parse(localStorage.getItem('historialEliminados') || '[]');
        
        // Crear lista de jugadores ya fichados por todos los clubes
        const jugadoresFichados = new Set();
        const jugadoresLibres = new Set(); // **NUEVO: Jugadores que quedaron libres**
        
        // Agregar jugadores que cambiaron de club o fueron contratados
        jugadoresActualizados.forEach(jugador => {
            const jugadorOriginal = window.jugadores.find(j => j.nombre === jugador.nombre);
            if (jugadorOriginal && jugadorOriginal.club !== jugador.club) {
                jugadoresFichados.add(jugador.nombre);
            }
        });
        
        // Agregar jugadores del historial de fichajes
        historialFichajes.forEach(fichaje => {
            jugadoresFichados.add(fichaje.jugador);
        });
        
        // **NUEVO: Procesar jugadores eliminados por contrato vencido**
        historialEliminados.forEach(eliminado => {
            if (eliminado.motivo === "Contrato vencido") {
                jugadoresLibres.add(eliminado.nombre);
                console.log(`🆓 Jugador disponible como libre: ${eliminado.nombre}`);
            }
        });
        
        // Obtener jugadores vendidos
        const jugadoresVendidos = JSON.parse(localStorage.getItem("jugadoresVendidos") || "[]");
        jugadoresVendidos.forEach(nombreJugador => {
            jugadoresFichados.add(nombreJugador);
        });
        
        console.log(`🔄 Sincronizando mercado - Jugadores ya fichados: ${jugadoresFichados.size}`);
        console.log(`🆓 Jugadores libres disponibles: ${jugadoresLibres.size}`);
        
        return { jugadoresFichados, jugadoresLibres };
    }
    
    // **FUNCIÓN MODIFICADA: Generar estados de transferencia considerando jugadores libres**
    function generarEstadoTransferencia(jugador, jugadoresLibres) {
        // Si el jugador está en la lista de libres, siempre será "libre"
        if (jugadoresLibres.has(jugador.nombre)) {
            return 'libre';
        }
        
        const estados = ['disponible', 'clausula', 'libre'];
        const random = Math.random();
        
        if (random < 0.6) return 'disponible';      // 60%
        if (random < 0.9) return 'clausula';       // 30%
        return 'libre';                             // 10%
    }
    
    // Calcular precio de transferencia según el estado
    function calcularPrecioTransferencia(jugador, estado) {
        const valorBase = jugador.valor;
        
        switch (estado) {
            case 'disponible':
                return Math.floor(valorBase * (0.8 + Math.random() * 0.4)); // 80-120%
            case 'clausula':
                return Math.floor(valorBase * (1.5 + Math.random() * 0.5)); // 150-200%
            case 'libre':
                return Math.floor(valorBase * (0.05 + Math.random() * 0.1)); // 5-15%
            default:
                return valorBase;
        }
    }
    
    // **FUNCIÓN MODIFICADA: Generar bonus considerando fecha del juego**
    function generarBonus(jugador) {
        const bonusBase = jugador.sueldo * 0.1;
        
        return {
            gol: jugador.posicion === "Delantero" ? Math.floor(bonusBase * (0.5 + Math.random() * 0.5)) : 0,
            arcoEnCero: jugador.posicion === "Defensa" ? Math.floor(bonusBase * (0.3 + Math.random() * 0.3)) : 0,
            firma: Math.floor(bonusBase * (0.2 + Math.random() * 0.8))
        };
    }
    
    // **FUNCIÓN MODIFICADA: Crear mercado de transferencias con sincronización completa**
    function crearMercadoTransferencias() {
        // Obtener jugadores ya fichados y libres
        const { jugadoresFichados, jugadoresLibres } = sincronizarJugadoresContratados();
        
        // Crear mercado excluyendo jugadores del equipo actual y ya fichados
        const mercado = window.jugadores
            .filter(jugador => {
                // Excluir jugadores del equipo actual
                if (jugador.club === equipoNombre) return false;
                
                // Excluir jugadores ya fichados (pero NO los libres)
                if (jugadoresFichados.has(jugador.nombre) && !jugadoresLibres.has(jugador.nombre)) return false;
                
                return true;
            })
            .map(jugador => {
                const estadoTransferencia = generarEstadoTransferencia(jugador, jugadoresLibres);
                const precioTransferencia = calcularPrecioTransferencia(jugador, estadoTransferencia);
                const bonus = generarBonus(jugador);
                
                // **NUEVO: Información adicional para jugadores libres**
                const infoAdicional = {};
                if (jugadoresLibres.has(jugador.nombre)) {
                    const eliminado = JSON.parse(localStorage.getItem('historialEliminados') || '[]')
                        .find(e => e.nombre === jugador.nombre);
                    if (eliminado) {
                        infoAdicional.motivoLibre = eliminado.motivo;
                        infoAdicional.fechaLibre = eliminado.fechaEliminacion;
                        infoAdicional.clubAnterior = eliminado.club;
                    }
                }
                
                return {
                    ...jugador,
                    estadoTransferencia: estadoTransferencia,
                    precioTransferencia: precioTransferencia,
                    bonusGol: bonus.gol,
                    bonusArcoEnCero: bonus.arcoEnCero,
                    bonusFirma: bonus.firma,
                    disponibleParaCompra: true,
                    esJugadorLibre: jugadoresLibres.has(jugador.nombre),
                    ...infoAdicional
                };
            });
        
        console.log(`📊 Mercado actualizado - Jugadores disponibles: ${mercado.length}`);
        console.log(`🆓 Jugadores libres en mercado: ${mercado.filter(j => j.esJugadorLibre).length}`);
        return mercado;
    }
    
    // Crear mercado de transferencias actualizado
    const mercadoTransferencias = crearMercadoTransferencias();
    
    // Variables para los elementos del DOM
    const playersGrid = document.getElementById('playersGrid');
    const positionFilter = document.getElementById('positionFilter');
    const priceFilter = document.getElementById('priceFilter');
    const priceValue = document.getElementById('priceValue');
    const clubFilter = document.getElementById('clubFilter');
    
    // Llenar filtro de clubes
    function llenarFiltroClub() {
        if (!clubFilter) return;
        
        const clubesUnicos = [...new Set(mercadoTransferencias.map(j => j.club))];
        clubesUnicos.forEach(club => {
            const option = document.createElement('option');
            option.value = club;
            option.textContent = club;
            clubFilter.appendChild(option);
        });
    }
    
    // **FUNCIÓN MODIFICADA: Obtener descripción del estado considerando jugadores libres**
    function obtenerDescripcionEstado(estado, esJugadorLibre, motivoLibre) {
        if (esJugadorLibre && motivoLibre) {
            return `Agente libre (${motivoLibre})`;
        }
        
        switch (estado) {
            case 'disponible': return 'Precio negociable';
            case 'clausula': return 'Cláusula de rescisión';
            case 'libre': return 'Agente libre';
            default: return 'No disponible';
        }
    }
    
    // **FUNCIÓN MODIFICADA: Crear tarjeta de jugador con información de jugadores libres**
    function crearTarjetaJugador(jugador) {
        const costoTotal = jugador.precioTransferencia + jugador.bonusFirma;
        
        // **NUEVO: Información adicional para jugadores libres**
        let infoLibre = '';
        if (jugador.esJugadorLibre) {
            infoLibre = `
                <div class="info-libre">
                    <small>Ex-club: ${jugador.clubAnterior || jugador.club}</small>
                    ${jugador.fechaLibre ? `<small>Libre desde: ${new Date(jugador.fechaLibre).toLocaleDateString()}</small>` : ''}
                </div>
            `;
        }
        
        const tarjeta = document.createElement('div');
        tarjeta.className = `player-card ${jugador.esJugadorLibre ? 'jugador-libre' : ''}`;
        tarjeta.innerHTML = `
            <div class="player-photo">
                <img src="/api/placeholder/80/80" alt="${jugador.nombre}">
                ${jugador.esJugadorLibre ? '<div class="badge-libre">LIBRE</div>' : ''}
            </div>
            <div class="player-details">
                <h3 class="player-name">${jugador.nombre}</h3>
                <p class="player-position">${jugador.posicion}</p>
                <p class="player-club">${jugador.club}</p>
                <div class="player-rating">
                    <span class="overall">OVR: ${jugador.general}</span>
                    <span class="potential">POT: ${jugador.potencial}</span>
                </div>
                ${infoLibre}
                <div class="transfer-info">
                    <p class="transfer-status">${obtenerDescripcionEstado(jugador.estadoTransferencia, jugador.esJugadorLibre, jugador.motivoLibre)}</p>
                    <p class="transfer-price">${formatearPrecio(costoTotal)}</p>
                </div>
                <button class="btn-negotiation" data-player-id="${jugador.id}">
                    Negociar
                </button>
            </div>
        `;
        
        return tarjeta;
    }
    
    // **FUNCIÓN MODIFICADA: Mostrar jugadores con verificación en tiempo real**
    function mostrarJugadores(jugadoresToShow = mercadoTransferencias) {
        if (!playersGrid) return;
        
        playersGrid.innerHTML = '';
        
        // Verificar disponibilidad en tiempo real
        const { jugadoresFichados, jugadoresLibres } = sincronizarJugadoresContratados();
        const jugadoresDisponibles = jugadoresToShow.filter(j => {
            return j.disponibleParaCompra && (!jugadoresFichados.has(j.nombre) || jugadoresLibres.has(j.nombre));
        });
        
        if (jugadoresDisponibles.length === 0) {
            playersGrid.innerHTML = '<p class="no-players">No hay jugadores disponibles con los filtros actuales</p>';
            return;
        }
        
        jugadoresDisponibles.forEach(jugador => {
            const tarjeta = crearTarjetaJugador(jugador);
            playersGrid.appendChild(tarjeta);
        });
        
        // Agregar event listeners a los botones de negociación
        document.querySelectorAll('.btn-negotiation').forEach(btn => {
            btn.addEventListener('click', function() {
                const jugadorId = parseInt(this.dataset.playerId);
                irANegociacion(jugadorId);
            });
        });
    }
    
    // **FUNCIÓN MODIFICADA: Ir a negociación con información actualizada**
    function irANegociacion(jugadorId) {
        const jugador = mercadoTransferencias.find(j => j.id === jugadorId);
        if (!jugador) return;
        
        // Verificar nuevamente que el jugador esté disponible
        const { jugadoresFichados, jugadoresLibres } = sincronizarJugadoresContratados();
        if (jugadoresFichados.has(jugador.nombre) && !jugadoresLibres.has(jugador.nombre)) {
            alert("Este jugador ya no está disponible en el mercado.");
            // Refrescar la vista
            mostrarJugadores();
            return;
        }
        
        // **NUEVO: Agregar información de fecha del juego al jugador seleccionado**
        const jugadorConFecha = {
            ...jugador,
            fechaJuegoActual: obtenerFechaJuego().toISOString()
        };
        
        // Guardar datos del jugador seleccionado en localStorage para la página de negociación
        localStorage.setItem('jugadorSeleccionado', JSON.stringify(jugadorConFecha));
        
        // Redirigir según el estado de transferencia
        if (jugador.estadoTransferencia === 'disponible') {
            window.location.href = 'negociarclub.html';
        } else if (jugador.estadoTransferencia === 'libre') {
            window.location.href = 'agente-libre.html';
        } else if (jugador.estadoTransferencia === 'clausula') {
            window.location.href = 'clausula-rescision.html';
        }
    }
    
    // Aplicar filtros
    function aplicarFiltros() {
        let jugadoresFiltrados = [...mercadoTransferencias];
        
        // Filtro por posición
        if (positionFilter && positionFilter.value !== 'all') {
            jugadoresFiltrados = jugadoresFiltrados.filter(j => j.posicion === positionFilter.value);
        }
        
        // Filtro por precio
        if (priceFilter) {
            const precioMaximo = parseInt(priceFilter.value);
            jugadoresFiltrados = jugadoresFiltrados.filter(j => 
                (j.precioTransferencia + j.bonusFirma) <= precioMaximo
            );
        }
        
        // Filtro por club
        if (clubFilter && clubFilter.value !== 'all') {
            jugadoresFiltrados = jugadoresFiltrados.filter(j => j.club === clubFilter.value);
        }
        
        mostrarJugadores(jugadoresFiltrados);
    }
    
    // Event listeners para filtros
    if (positionFilter) {
        positionFilter.addEventListener('change', aplicarFiltros);
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('input', function() {
            if (priceValue) {
                priceValue.textContent = formatearPrecio(parseInt(this.value));
            }
            aplicarFiltros();
        });
    }
    
    if (clubFilter) {
        clubFilter.addEventListener('change', aplicarFiltros);
    }
    
    // **FUNCIÓN MODIFICADA: Refrescar mercado con sincronización completa**
    function refrescarMercado() {
        const mercadoActualizado = crearMercadoTransferencias();
        
        // Actualizar el mercado global
        mercadoTransferencias.length = 0;
        mercadoTransferencias.push(...mercadoActualizado);
        
        // **NUEVO: Actualizar presupuesto**
        window.miEquipoInfo.actualizarPresupuesto();
        
        // Refrescar vista
        aplicarFiltros();
        
        console.log("🔄 Mercado de transferencias actualizado con fecha del juego:", obtenerFechaJuego().toLocaleDateString());
        console.log("💰 Presupuesto actualizado:", window.miEquipoInfo.presupuestoFormateado);
    }
    
    // **NUEVO: Escuchar cambios de fecha del calendario**
    window.addEventListener('fechaCambiada', function(e) {
        console.log("📅 Fecha del juego cambió - Actualizando mercado de transferencias...");
        console.log("Nueva fecha:", e.detail.fecha.toLocaleDateString());
        
        // Actualizar info del equipo
        window.miEquipoInfo.fechaJuego = e.detail.fecha;
        
        // Refrescar mercado después de un pequeño delay
        setTimeout(refrescarMercado, 1000);
    });
    
    // **EVENTO MODIFICADO: Escuchar cambios en localStorage incluyendo contratos y finanzas**
    window.addEventListener('storage', function(e) {
        if (e.key === 'jugadores' || e.key === 'historialFichajes' || e.key === 'jugadoresVendidos' || e.key === 'historialEliminados' || e.key === 'finanzasClub') {
            console.log("📱 Detectado cambio en plantillas/contratos/finanzas - Actualizando mercado...");
            setTimeout(refrescarMercado, 500);
        }
    });
    
    // **FUNCIÓN GLOBAL: Refrescar manualmente**
    window.refrescarMercadoTransferencias = refrescarMercado;
    
    // **SISTEMA GLOBAL MODIFICADO: Con información de fecha del juego**
    window.sistemaTransferencias = {
        mercado: mercadoTransferencias,
        fechaJuego: obtenerFechaJuego(),
        mostrarMercado: function() {
            console.log("=== MERCADO DE TRANSFERENCIAS ===");
            console.log(`Fecha del juego: ${this.fechaJuego.toLocaleDateString()}`);
            console.log(`Presupuesto disponible: ${window.miEquipoInfo.presupuestoFormateado}`);
            
            const { jugadoresFichados, jugadoresLibres } = sincronizarJugadoresContratados();
            const disponibles = mercadoTransferencias.filter(j => 
                j.disponibleParaCompra && (!jugadoresFichados.has(j.nombre) || jugadoresLibres.has(j.nombre))
            );
            
            const libres = disponibles.filter(j => j.esJugadorLibre);
            
            console.log(`🆓 Jugadores libres: ${libres.length}`);
            libres.forEach(jugador => {
                const costoTotal = jugador.precioTransferencia + jugador.bonusFirma;
                console.log(`   📋 ${jugador.nombre} (ID: ${jugador.id}) - ${formatearPrecio(costoTotal)} - Ex: ${jugador.clubAnterior || jugador.club}`);
            });
            
            console.log(`💰 Otros jugadores: ${disponibles.length - libres.length}`);
            disponibles.filter(j => !j.esJugadorLibre).forEach(jugador => {
                const costoTotal = jugador.precioTransferencia + jugador.bonusFirma;
                console.log(`   📋 ${jugador.nombre} (ID: ${jugador.id}) - ${formatearPrecio(costoTotal)}`);
            });
            
            console.log(`Total disponibles: ${disponibles.length}`);
        },
        buscarJugador: function(nombre) {
            const { jugadoresFichados, jugadoresLibres } = sincronizarJugadoresContratados();
            return mercadoTransferencias.find(j => 
                j.nombre.toLowerCase().includes(nombre.toLowerCase()) && 
                j.disponibleParaCompra && 
                (!jugadoresFichados.has(j.nombre) || jugadoresLibres.has(j.nombre))
            );
        },
        mostrarLibres: function() {
            const libres = mercadoTransferencias.filter(j => j.esJugadorLibre);
            console.log(`🆓 Jugadores libres disponibles: ${libres.length}`);
            libres.forEach(j => console.log(`   ${j.nombre} - ${j.motivoLibre} (Ex: ${j.clubAnterior || j.club})`));
        },
        refrescar: refrescarMercado,
        formatearPrecio: formatearPrecio
    };
    
    // Inicializar la interfaz
    llenarFiltroClub();
    mostrarJugadores();
    
    console.log("💼 Sistema de transferencias inicializado con sincronización completa");
    console.log(`📊 Jugadores disponibles: ${mercadoTransferencias.filter(j => j.disponibleParaCompra).length}`);
    console.log(`🆓 Jugadores libres: ${mercadoTransferencias.filter(j => j.esJugadorLibre).length}`);
    console.log(`📅 Fecha del juego: ${obtenerFechaJuego().toLocaleDateString()}`);
    console.log(`💰 Presupuesto actual: ${formatearPrecio(presupuestoActual)}`);
    console.log("📝 Usa sistemaTransferencias.mostrarMercado() para ver jugadores en consola");
    console.log("🆓 Usa sistemaTransferencias.mostrarLibres() para ver solo jugadores libres");
    console.log("🔄 Usa sistemaTransferencias.refrescar() para actualizar manualmente");
});
