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
    
    // **FUNCIÓN MODIFICADA: Obtener presupuesto actualizado considerando finanzas**
    function obtenerPresupuestoActual() {
        // Primero verificar si hay finanzas guardadas
        const finanzasGuardadas = localStorage.getItem("finanzasClub");
        if (finanzasGuardadas) {
            const finanzas = JSON.parse(finanzasGuardadas);
            return finanzas.saldo;
        }
        
        // Si no hay finanzas, usar el presupuesto guardado o el original
        const presupuestoGuardado = localStorage.getItem(`presupuesto_${equipoNombre}`);
        return presupuestoGuardado ? parseInt(presupuestoGuardado) : miEquipo.presupuesto;
    }
    
    // **FUNCIÓN NUEVA: Actualizar presupuesto después de una compra**
    function actualizarPresupuestoDespuesCompra(costoTotal) {
        const presupuestoActual = obtenerPresupuestoActual();
        const nuevoPresupuesto = presupuestoActual - costoTotal;
        
        // Actualizar en finanzas si existe el sistema
        const finanzasGuardadas = localStorage.getItem("finanzasClub");
        if (finanzasGuardadas) {
            const finanzas = JSON.parse(finanzasGuardadas);
            finanzas.saldo = nuevoPresupuesto;
            localStorage.setItem("finanzasClub", JSON.stringify(finanzas));
        }
        
        // También actualizar el presupuesto específico del equipo
        localStorage.setItem(`presupuesto_${equipoNombre}`, nuevoPresupuesto.toString());
        
        // Actualizar la interfaz si existe
        const elementoPresupuesto = document.getElementById('currentBudget');
        if (elementoPresupuesto) {
            elementoPresupuesto.textContent = formatearPrecio(nuevoPresupuesto);
        }
        
        // Actualizar el objeto global
        if (window.miEquipoInfo) {
            window.miEquipoInfo.presupuesto = nuevoPresupuesto;
            window.miEquipoInfo.presupuestoFormateado = formatearPrecio(nuevoPresupuesto);
        }
        
        console.log(`💰 Presupuesto actualizado: ${formatearPrecio(nuevoPresupuesto)} (gastado: ${formatearPrecio(costoTotal)})`);
        return nuevoPresupuesto;
    }
    
    // Obtener presupuesto actual
    const presupuestoActual = obtenerPresupuestoActual();
    
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
    
    // **OBJETO GLOBAL MODIFICADO: Con funciones de actualización de presupuesto**
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
        
        // **NUEVO: Método para actualizar presupuesto**
        actualizarPresupuesto: function(nuevoPresupuesto) {
            this.presupuesto = nuevoPresupuesto;
            this.presupuestoFormateado = formatearPrecio(nuevoPresupuesto);
            
            const elementoPresupuesto = document.getElementById('currentBudget');
            if (elementoPresupuesto) {
                elementoPresupuesto.textContent = this.presupuestoFormateado;
            }
        },
        
        // **NUEVO: Método para obtener presupuesto actualizado**
        obtenerPresupuestoActual: obtenerPresupuestoActual
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
    
    // **FUNCIÓN MODIFICADA: Refrescar mercado con sincronización completa y presupuesto actualizado**
    function refrescarMercado() {
        const mercadoActualizado = crearMercadoTransferencias();
        
        // Actualizar el mercado global
        mercadoTransferencias.length = 0;
        mercadoTransferencias.push(...mercadoActualizado);
        
        // **NUEVO: Actualizar presupuesto en la interfaz**
        const presupuestoActual = obtenerPresupuestoActual();
        window.miEquipoInfo.actualizarPresupuesto(presupuestoActual);
        
        // Refrescar vista
        aplicarFiltros();
        
        console.log("🔄 Mercado de transferencias actualizado con fecha del juego:", obtenerFechaJuego().toLocaleDateString());
        console.log("💰 Presupuesto actualizado:", formatearPrecio(presupuestoActual));
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
    
    // **NUEVA FUNCIÓN: Listener para cuando se complete una compra**
    window.addEventListener('compraRealizada', function(e) {
        if (e.detail && e.detail.costoTotal) {
            console.log("💳 Compra realizada - Actualizando presupuesto...");
            actualizarPresupuestoDespuesCompra(e.detail.costoTotal);
            setTimeout(refrescarMercado, 1000);
        }
    });
    
    // **FUNCIÓN GLOBAL: Refrescar manualmente**
    window.refrescarMercadoTransferencias = refrescarMercado;
    
    // **FUNCIÓN GLOBAL: Para que las páginas de negociación puedan actualizar el presupuesto**
    window.actualizarPresupuestoDespuesCompra = actualizarPresupuestoDespuesCompra;
    
    // **SISTEMA GLOBAL MODIFICADO: Con información de fecha del juego y funciones de presupuesto**
    window.sistemaTransferencias = {
        mercado: mercadoTransferencias,
        fechaJuego: obtenerFechaJuego(),
        presupuestoActual: presupuestoActual,
        
        mostrarMercado: function() {
            console.log("=== MERCADO DE TRANSFERENCIAS ===");
            console.log(`Fecha del juego: ${this.fechaJuego.toLocaleDateString()}`);
            console.log(`Presupuesto disponible: ${formatearPrecio(obtenerPresupuestoActual())}`);
            
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
        
        // **NUEVAS FUNCIONES: Para manejo de presupuesto**
        mostrarPresupuesto: function() {
            const presupuesto = obtenerPresupuestoActual();
            console.log(`💰 Presupuesto actual: ${formatearPrecio(presupuesto)}`);
            return presupuesto;
        },
        
        simularCompra: function(jugadorNombre, costoTotal) {
            const presupuestoActual = obtenerPresupuestoActual();
            if (costoTotal > presupuestoActual) {
                console.log(`❌ No hay suficiente presupuesto para ${jugadorNombre}`);
                console.log(`   Costo: ${formatearPrecio(costoTotal)} | Disponible: ${formatearPrecio(presupuestoActual)}`);
                return false;
            } else {
                console.log(`✅ Compra posible de ${jugadorNombre}`);
                console.log(`   Costo: ${formatearPrecio(costoTotal)} | Disponible: ${formatearPrecio(presupuestoActual)}`);
                console.log(`   Presupuesto restante: ${formatearPrecio(presupuestoActual - costoTotal)}`);
                return true;
            }
        }
    };
    
    // Inicializar interfaz
    llenarFiltroClub();
    mostrarJugadores();
    
    // **FUNCIÓN NUEVA: Auto-actualización periódica del mercado**
    setInterval(function() {
        // Verificar si hay cambios en localStorage cada 30 segundos
        const fechaGuardada = localStorage.getItem("fechaJuego");
        const fechaActual = window.miEquipoInfo.fechaJuego.toISOString();
        
        if (fechaGuardada && fechaGuardada !== fechaActual) {
            console.log("🔄 Detectado cambio de fecha - Auto-actualizando mercado...");
            window.miEquipoInfo.fechaJuego = new Date(fechaGuardada);
            refrescarMercado();
        }
    }, 30000); // Cada 30 segundos
    
    // **FUNCIÓN NUEVA: Notificaciones de mercado**
    function mostrarNotificacionMercado(mensaje, tipo = 'info') {
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion-mercado ${tipo}`;
        notificacion.innerHTML = `
            <div class="notificacion-contenido">
                <span class="notificacion-icono">${tipo === 'success' ? '✅' : tipo === 'warning' ? '⚠️' : 'ℹ️'}</span>
                <span class="notificacion-texto">${mensaje}</span>
                <button class="notificacion-cerrar" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Agregar estilos si no existen
        if (!document.querySelector('#estilos-notificacion')) {
            const estilos = document.createElement('style');
            estilos.id = 'estilos-notificacion';
            estilos.textContent = `
                .notificacion-mercado {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1000;
                    max-width: 300px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    animation: slideIn 0.3s ease-out;
                }
                
                .notificacion-mercado.success { border-left: 4px solid #22c55e; }
                .notificacion-mercado.warning { border-left: 4px solid #f59e0b; }
                .notificacion-mercado.info { border-left: 4px solid #3b82f6; }
                
                .notificacion-contenido {
                    padding: 12px 16px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .notificacion-icono { font-size: 16px; }
                .notificacion-texto { flex: 1; font-size: 14px; }
                .notificacion-cerrar {
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    color: #666;
                }
                
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(estilos);
        }
        
        document.body.appendChild(notificacion);
        
        // Auto-eliminar después de 5 segundos
        setTimeout(() => {
            if (notificacion.parentElement) {
                notificacion.remove();
            }
        }, 5000);
    }
    
    // **FUNCIÓN NUEVA: Sistema de alertas del mercado**
    function verificarAlertas() {
        const presupuestoActual = obtenerPresupuestoActual();
        const { jugadoresFichados, jugadoresLibres } = sincronizarJugadoresContratados();
        
        // Alerta de presupuesto bajo
        if (presupuestoActual < 100000) { // Menos de 100K
            mostrarNotificacionMercado(
                `Presupuesto bajo: ${formatearPrecio(presupuestoActual)}`, 
                'warning'
            );
        }
        
        // Alerta de jugadores libres disponibles
        const libresDisponibles = mercadoTransferencias.filter(j => j.esJugadorLibre);
        if (libresDisponibles.length > 0) {
            mostrarNotificacionMercado(
                `${libresDisponibles.length} jugadores libres disponibles`, 
                'info'
            );
        }
        
        // Alerta de jugadores baratos de calidad
        const gangasDisponibles = mercadoTransferencias.filter(j => {
            const costoTotal = j.precioTransferencia + j.bonusFirma;
            return j.general >= 75 && costoTotal <= presupuestoActual * 0.1; // Jugadores buenos y baratos
        });
        
        if (gangasDisponibles.length > 0) {
            mostrarNotificacionMercado(
                `${gangasDisponibles.length} ofertas recomendadas encontradas`, 
                'success'
            );
        }
    }
    
    // **FUNCIÓN NUEVA: Estadísticas del mercado**
    function generarEstadisticasMercado() {
        const { jugadoresFichados, jugadoresLibres } = sincronizarJugadoresContratados();
        const disponibles = mercadoTransferencias.filter(j => 
            j.disponibleParaCompra && (!jugadoresFichados.has(j.nombre) || jugadoresLibres.has(j.nombre))
        );
        
        const estadisticas = {
            totalDisponibles: disponibles.length,
            jugadoresLibres: disponibles.filter(j => j.esJugadorLibre).length,
            porPosicion: {},
            porRangoPresupuesto: {
                bajo: 0,    // < 500K
                medio: 0,   // 500K - 2M
                alto: 0,    // 2M - 10M
                premium: 0  // > 10M
            },
            promedioGeneral: 0,
            mejoresFichajes: []
        };
        
        // Calcular estadísticas por posición
        disponibles.forEach(jugador => {
            // Por posición
            if (!estadisticas.porPosicion[jugador.posicion]) {
                estadisticas.porPosicion[jugador.posicion] = 0;
            }
            estadisticas.porPosicion[jugador.posicion]++;
            
            // Por rango de presupuesto
            const costoTotal = jugador.precioTransferencia + jugador.bonusFirma;
            if (costoTotal < 500000) {
                estadisticas.porRangoPresupuesto.bajo++;
            } else if (costoTotal < 2000000) {
                estadisticas.porRangoPresupuesto.medio++;
            } else if (costoTotal < 10000000) {
                estadisticas.porRangoPresupuesto.alto++;
            } else {
                estadisticas.porRangoPresupuesto.premium++;
            }
        });
        
        // Promedio general
        if (disponibles.length > 0) {
            estadisticas.promedioGeneral = Math.round(
                disponibles.reduce((sum, j) => sum + j.general, 0) / disponibles.length
            );
        }
        
        // Mejores fichajes (jugadores con mejor relación calidad/precio)
        estadisticas.mejoresFichajes = disponibles
            .map(jugador => {
                const costoTotal = jugador.precioTransferencia + jugador.bonusFirma;
                const relacion = jugador.general / (costoTotal / 1000000); // General por millón
                return { ...jugador, relacionCalidadPrecio: relacion, costoTotal };
            })
            .sort((a, b) => b.relacionCalidadPrecio - a.relacionCalidadPrecio)
            .slice(0, 5); // Top 5
        
        return estadisticas;
    }
    
    // **FUNCIÓN NUEVA: Mostrar panel de estadísticas**
    function mostrarPanelEstadisticas() {
        const stats = generarEstadisticasMercado();
        
        const panel = document.createElement('div');
        panel.className = 'panel-estadisticas';
        panel.innerHTML = `
            <div class="panel-header">
                <h3>📊 Estadísticas del Mercado</h3>
                <button class="btn-cerrar-panel" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="panel-contenido">
                <div class="stat-card">
                    <h4>Resumen General</h4>
                    <p>Jugadores disponibles: <strong>${stats.totalDisponibles}</strong></p>
                    <p>Agentes libres: <strong>${stats.jugadoresLibres}</strong></p>
                    <p>General promedio: <strong>${stats.promedioGeneral}</strong></p>
                </div>
                
                <div class="stat-card">
                    <h4>Por Posición</h4>
                    ${Object.entries(stats.porPosicion)
                        .map(([pos, cant]) => `<p>${pos}: <strong>${cant}</strong></p>`)
                        .join('')}
                </div>
                
                <div class="stat-card">
                    <h4>Por Rango de Precio</h4>
                    <p>Económicos (&lt;500K): <strong>${stats.porRangoPresupuesto.bajo}</strong></p>
                    <p>Medios (500K-2M): <strong>${stats.porRangoPresupuesto.medio}</strong></p>
                    <p>Caros (2M-10M): <strong>${stats.porRangoPresupuesto.alto}</strong></p>
                    <p>Premium (&gt;10M): <strong>${stats.porRangoPresupuesto.premium}</strong></p>
                </div>
                
                <div class="stat-card">
                    <h4>🏆 Mejores Fichajes</h4>
                    ${stats.mejoresFichajes
                        .map(j => `
                            <div class="mejor-fichaje">
                                <strong>${j.nombre}</strong> (${j.posicion})<br>
                                <small>OVR: ${j.general} | ${formatearPrecio(j.costoTotal)} | Relación: ${j.relacionCalidadPrecio.toFixed(1)}</small>
                            </div>
                        `).join('')}
                </div>
            </div>
        `;
        
        // Agregar estilos para el panel
        if (!document.querySelector('#estilos-panel-stats')) {
            const estilos = document.createElement('style');
            estilos.id = 'estilos-panel-stats';
            estilos.textContent = `
                .panel-estadisticas {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                    z-index: 2000;
                    max-width: 800px;
                    max-height: 80vh;
                    overflow-y: auto;
                }
                
                .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    border-bottom: 1px solid #e5e7eb;
                    background: #f8fafc;
                    border-radius: 12px 12px 0 0;
                }
                
                .panel-header h3 {
                    margin: 0;
                    color: #1f2937;
                }
                
                .btn-cerrar-panel {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #6b7280;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                }
                
                .btn-cerrar-panel:hover {
                    background: #e5e7eb;
                }
                
                .panel-contenido {
                    padding: 20px;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                }
                
                .stat-card {
                    background: #f8fafc;
                    padding: 16px;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                }
                
                .stat-card h4 {
                    margin: 0 0 12px 0;
                    color: #374151;
                    font-size: 16px;
                }
                
                .stat-card p {
                    margin: 6px 0;
                    color: #6b7280;
                    font-size: 14px;
                }
                
                .mejor-fichaje {
                    background: white;
                    padding: 8px;
                    border-radius: 4px;
                    margin: 6px 0;
                    border-left: 3px solid #10b981;
                }
                
                .mejor-fichaje strong {
                    color: #059669;
                }
            `;
            document.head.appendChild(estilos);
        }
        
        document.body.appendChild(panel);
        
        // Crear overlay de fondo
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1999;
        `;
        overlay.onclick = () => {
            panel.remove();
            overlay.remove();
        };
        document.body.appendChild(overlay);
    }
    
    // **FUNCIONES GLOBALES ADICIONALES**
    window.mostrarEstadisticasMercado = mostrarPanelEstadisticas;
    window.verificarAlertasMercado = verificarAlertas;
    
    // **AGREGAR BOTÓN DE ESTADÍSTICAS SI EXISTE UN CONTENEDOR**
    const contenedorBotones = document.querySelector('.market-controls') || document.querySelector('.filters-container');
    if (contenedorBotones) {
        const botonStats = document.createElement('button');
        botonStats.className = 'btn-stats-mercado';
        botonStats.innerHTML = '📊 Estadísticas';
        botonStats.onclick = mostrarPanelEstadisticas;
        
        // Estilos para el botón
        botonStats.style.cssText = `
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            margin-left: 10px;
        `;
        
        contenedorBotones.appendChild(botonStats);
    }
    
    // **VERIFICAR ALERTAS AL CARGAR**
    setTimeout(verificarAlertas, 2000);
    
    // **FUNCIÓN MEJORADA: Búsqueda avanzada de jugadores**
    window.busquedaAvanzada = function(filtros = {}) {
        const {
            nombre = '',
            posicion = '',
            generalMin = 0,
            generalMax = 99,
            presupuestoMax = Infinity,
            soloLibres = false,
            clubExcluir = ''
        } = filtros;
        
        const { jugadoresFichados, jugadoresLibres } = sincronizarJugadoresContratados();
        
        const resultados = mercadoTransferencias.filter(jugador => {
            // Verificar disponibilidad
            if (!jugador.disponibleParaCompra) return false;
            if (jugadoresFichados.has(jugador.nombre) && !jugadoresLibres.has(jugador.nombre)) return false;
            
            // Filtros de búsqueda
            if (nombre && !jugador.nombre.toLowerCase().includes(nombre.toLowerCase())) return false;
            if (posicion && jugador.posicion !== posicion) return false;
            if (jugador.general < generalMin || jugador.general > generalMax) return false;
            if (clubExcluir && jugador.club === clubExcluir) return false;
            if (soloLibres && !jugador.esJugadorLibre) return false;
            
            const costoTotal = jugador.precioTransferencia + jugador.bonusFirma;
            if (costoTotal > presupuestoMax) return false;
            
            return true;
        });
        
        console.log(`🔍 Búsqueda avanzada - Encontrados: ${resultados.length} jugadores`);
        resultados.forEach(j => {
            const costo = j.precioTransferencia + j.bonusFirma;
            console.log(`   ${j.nombre} (${j.posicion}) - OVR: ${j.general} - ${formatearPrecio(costo)}${j.esJugadorLibre ? ' [LIBRE]' : ''}`);
        });
        
        return resultados;
    };
    
    // **SISTEMA DE GUARDADO DE FAVORITOS**
    window.sistemaFavoritos = {
        agregar: function(jugadorId) {
            const favoritos = JSON.parse(localStorage.getItem('jugadoresFavoritos') || '[]');
            if (!favoritos.includes(jugadorId)) {
                favoritos.push(jugadorId);
                localStorage.setItem('jugadoresFavoritos', JSON.stringify(favoritos));
                mostrarNotificacionMercado('Jugador agregado a favoritos', 'success');
            }
        },
        
        quitar: function(jugadorId) {
            const favoritos = JSON.parse(localStorage.getItem('jugadoresFavoritos') || '[]');
            const nuevos = favoritos.filter(id => id !== jugadorId);
            localStorage.setItem('jugadoresFavoritos', JSON.stringify(nuevos));
            mostrarNotificacionMercado('Jugador quitado de favoritos', 'info');
        },
        
        obtener: function() {
            const favoritos = JSON.parse(localStorage.getItem('jugadoresFavoritos') || '[]');
            return mercadoTransferencias.filter(j => favoritos.includes(j.id));
        },
        
        mostrar: function() {
            const favoritos = this.obtener();
            console.log(`⭐ Jugadores favoritos: ${favoritos.length}`);
            favoritos.forEach(j => {
                const costo = j.precioTransferencia + j.bonusFirma;
                console.log(`   ${j.nombre} - ${formatearPrecio(costo)}`);
            });
        }
    };
    
    console.log("✅ Sistema de transferencias completamente inicializado");
    console.log("📋 Funciones disponibles:");
    console.log("   - window.sistemaTransferencias.mostrarMercado()");
    console.log("   - window.sistemaTransferencias.mostrarLibres()");
    console.log("   - window.busquedaAvanzada({filtros})");
    console.log("   - window.mostrarEstadisticasMercado()");
    console.log("   - window.sistemaFavoritos.obtener()");
    console.log("   - window.refrescarMercadoTransferencias()");
});
