// Sistema simple para mostrar equipo y presupuesto + Sistema de transferencias 
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
    
    // Obtener presupuesto (puede haber sido modificado previamente)
    const presupuestoGuardado = localStorage.getItem(`presupuesto_${equipoNombre}`);
    const presupuestoActual = presupuestoGuardado ? parseInt(presupuestoGuardado) : miEquipo.presupuesto;
    
    // Obtener jugadores de mi equipo (incluyendo los comprados)
    function obtenerJugadoresEquipo() {
        // La plantilla se guarda en "jugadores" en localStorage
        const jugadoresGuardados = localStorage.getItem("jugadores");
        
        if (jugadoresGuardados) {
            try {
                const todosLosJugadores = JSON.parse(jugadoresGuardados);
                // Filtrar solo los jugadores que pertenecen a mi equipo
                const jugadoresDelEquipo = todosLosJugadores.filter(j => j.club === equipoNombre);
                console.log(`✓ Jugadores de ${equipoNombre} encontrados: ${jugadoresDelEquipo.length}`);
                return jugadoresDelEquipo;
            } catch (e) {
                console.warn("Error al parsear jugadores:", e);
            }
        }
        
        // Si no hay jugadores guardados, usar los originales del window.jugadores
        if (window.jugadores && Array.isArray(window.jugadores)) {
            return window.jugadores.filter(j => j.club === equipoNombre);
        }
        
        return [];
    }
    
    const jugadoresEquipo = obtenerJugadoresEquipo();
    
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
    console.log(`Jugadores en plantilla: ${jugadoresEquipo.length}`);
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
        jugadores: jugadoresEquipo,
        
        // Método para mostrar información
        mostrarInfo: function() {
            console.log(`Equipo: ${this.nombre} | Presupuesto: ${this.presupuestoFormateado} | Jugadores: ${this.jugadores.length}`);
        },
        
        // Método para actualizar plantilla
        actualizarPlantilla: function() {
            const plantillaActualizada = obtenerJugadoresEquipo();
            this.jugadores = plantillaActualizada;
            return plantillaActualizada;
        },
        
        // Método para actualizar presupuesto
        actualizarPresupuesto: function() {
            const presupuestoGuardado = localStorage.getItem(`presupuesto_${equipoNombre}`);
            this.presupuesto = presupuestoGuardado ? parseInt(presupuestoGuardado) : miEquipo.presupuesto;
            this.presupuestoFormateado = formatearPrecio(this.presupuesto);
            
            // Actualizar en DOM si existe
            if (elementoPresupuesto) {
                elementoPresupuesto.textContent = this.presupuestoFormateado;
            }
            
            return this.presupuesto;
        }
    };
    
    // ========== SISTEMA DE TRANSFERENCIAS ==========
    
    // Verificar que existan los datos de jugadores
    if (!window.jugadores || !Array.isArray(window.jugadores)) {
        console.log("⚠️ No se encontraron datos de jugadores - Sistema de transferencias no disponible");
        return;
    }
    
    // Generar estados de transferencia para cada jugador
    function generarEstadoTransferencia() {
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
    
    // Generar bonus por rendimiento
    function generarBonus(jugador) {
        const bonusBase = jugador.sueldo * 0.1;
        
        return {
            gol: jugador.posicion === "Delantero" ? Math.floor(bonusBase * (0.5 + Math.random() * 0.5)) : 0,
            arcoEnCero: jugador.posicion === "Defensa" ? Math.floor(bonusBase * (0.3 + Math.random() * 0.3)) : 0,
            firma: Math.floor(bonusBase * (0.2 + Math.random() * 0.8))
        };
    }
    
    // Crear mercado de transferencias (excluyendo jugadores del equipo actual Y jugadores ya comprados)
    function crearMercadoTransferencias() {
        // Obtener TODOS los jugadores actualizados de localStorage
        const jugadoresActualizados = localStorage.getItem("jugadores");
        let todosLosJugadores = [];
        
        if (jugadoresActualizados) {
            try {
                todosLosJugadores = JSON.parse(jugadoresActualizados);
                console.log("✓ Usando jugadores actualizados de localStorage");
            } catch (e) {
                console.warn("Error al parsear jugadores actualizados:", e);
                // Usar jugadores originales como fallback
                todosLosJugadores = window.jugadores || [];
            }
        } else {
            // Si no hay jugadores en localStorage, usar los originales
            todosLosJugadores = window.jugadores || [];
            console.log("✓ Usando jugadores originales de window.jugadores");
        }
        
        // Filtrar jugadores que NO pertenecen a mi equipo
        const jugadoresDisponibles = todosLosJugadores.filter(jugador => jugador.club !== equipoNombre);
        
        return jugadoresDisponibles.map(jugador => {
            const estadoTransferencia = generarEstadoTransferencia();
            const precioTransferencia = calcularPrecioTransferencia(jugador, estadoTransferencia);
            const bonus = generarBonus(jugador);
            
            return {
                ...jugador,
                estadoTransferencia: estadoTransferencia,
                precioTransferencia: precioTransferencia,
                bonusGol: bonus.gol,
                bonusArcoEnCero: bonus.arcoEnCero,
                bonusFirma: bonus.firma,
                disponibleParaCompra: true
            };
        });
    }
    
    let mercadoTransferencias = crearMercadoTransferencias();
    
    // Variables para los elementos del DOM
    const playersGrid = document.getElementById('playersGrid');
    const positionFilter = document.getElementById('positionFilter');
    const priceFilter = document.getElementById('priceFilter');
    const priceValue = document.getElementById('priceValue');
    const clubFilter = document.getElementById('clubFilter');
    
    // Llenar filtro de clubes
    function llenarFiltroClub() {
        if (!clubFilter) return;
        
        // Limpiar opciones existentes (excepto la primera)
        const firstOption = clubFilter.querySelector('option[value="all"]');
        clubFilter.innerHTML = '';
        if (firstOption) {
            clubFilter.appendChild(firstOption);
        } else {
            const allOption = document.createElement('option');
            allOption.value = 'all';
            allOption.textContent = 'Todos los clubes';
            clubFilter.appendChild(allOption);
        }
        
        const clubesUnicos = [...new Set(mercadoTransferencias.map(j => j.club))].sort();
        clubesUnicos.forEach(club => {
            const option = document.createElement('option');
            option.value = club;
            option.textContent = club;
            clubFilter.appendChild(option);
        });
    }
    
    // Función para obtener descripción del estado
    function obtenerDescripcionEstado(estado) {
        switch (estado) {
            case 'disponible': return 'Precio negociable';
            case 'clausula': return 'Cláusula de rescisión';
            case 'libre': return 'Agente libre';
            default: return 'No disponible';
        }
    }
    
    // Crear tarjeta de jugador
    function crearTarjetaJugador(jugador) {
        const costoTotal = jugador.precioTransferencia + jugador.bonusFirma;
        
        const tarjeta = document.createElement('div');
        tarjeta.className = 'player-card';
        tarjeta.innerHTML = `
            <div class="player-photo">
                <img src="/api/placeholder/80/80" alt="${jugador.nombre}">
            </div>
            <div class="player-details">
                <h3 class="player-name">${jugador.nombre}</h3>
                <p class="player-position">${jugador.posicion}</p>
                <p class="player-club">${jugador.club}</p>
                <div class="player-rating">
                    <span class="overall">OVR: ${jugador.general}</span>
                    <span class="potential">POT: ${jugador.potencial}</span>
                </div>
                <div class="transfer-info">
                    <p class="transfer-status">${obtenerDescripcionEstado(jugador.estadoTransferencia)}</p>
                    <p class="transfer-price">${formatearPrecio(costoTotal)}</p>
                </div>
                <button class="btn-negotiation" data-player-id="${jugador.id}">
                    Negociar
                </button>
            </div>
        `;
        
        return tarjeta;
    }
    
    // Mostrar jugadores en la interfaz
    function mostrarJugadores(jugadoresToShow = mercadoTransferencias) {
        if (!playersGrid) {
            console.log("⚠️ Elemento playersGrid no encontrado en el DOM");
            return;
        }
        
        playersGrid.innerHTML = '';
        
        const jugadoresDisponibles = jugadoresToShow.filter(j => j.disponibleParaCompra);
        
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
        
        console.log(`✓ Mostrando ${jugadoresDisponibles.length} jugadores en la interfaz`);
    }
    
    // Función para ir a la página de negociación
    function irANegociacion(jugadorId) {
        const jugador = mercadoTransferencias.find(j => j.id === jugadorId);
        if (!jugador) {
            console.error(`❌ No se encontró el jugador con ID: ${jugadorId}`);
            return;
        }
        
        // Guardar datos del jugador seleccionado en localStorage para la página de negociación
        localStorage.setItem('jugadorSeleccionado', JSON.stringify(jugador));
        
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
    
    // Función para actualizar mercado (llamar después de una compra exitosa)
    function actualizarMercado() {
        console.log("🔄 Actualizando mercado de transferencias...");
        mercadoTransferencias = crearMercadoTransferencias();
        llenarFiltroClub();
        aplicarFiltros();
        
        // También actualizar información del equipo
        window.miEquipoInfo.actualizarPlantilla();
        window.miEquipoInfo.actualizarPresupuesto();
        
        console.log("📊 Mercado actualizado - Jugadores disponibles:", mercadoTransferencias.length);
    }
    
    // Crear sistema global de transferencias (para consola)
    window.sistemaTransferencias = {
        mercado: mercadoTransferencias,
        actualizarMercado: actualizarMercado,
        mostrarMercado: function() {
            console.log("=== MERCADO DE TRANSFERENCIAS ===");
            const disponibles = mercadoTransferencias.filter(j => j.disponibleParaCompra);
            disponibles.forEach(jugador => {
                const costoTotal = jugador.precioTransferencia + jugador.bonusFirma;
                console.log(`📋 ${jugador.nombre} (${jugador.posicion}) - ${jugador.club} - ${formatearPrecio(costoTotal)} [${jugador.estadoTransferencia}]`);
            });
            console.log(`Total jugadores disponibles: ${disponibles.length}`);
        },
        buscarJugador: function(nombre) {
            return mercadoTransferencias.find(j => 
                j.nombre.toLowerCase().includes(nombre.toLowerCase()) && j.disponibleParaCompra
            );
        },
        formatearPrecio: formatearPrecio
    };
    
    // Listener para detectar cambios en localStorage (cuando se compra un jugador)
    window.addEventListener('storage', function(e) {
        if (e.key === 'jugadores' || e.key === 'contratoFirmado' || e.key.startsWith('presupuesto_')) {
            console.log("📈 Detectado cambio en localStorage:", e.key);
            setTimeout(actualizarMercado, 100); // Pequeño delay para asegurar que los cambios estén guardados
        }
    });
    
    // También escuchar evento personalizado para actualizaciones en la misma pestaña
    window.addEventListener('plantillaActualizada', function() {
        console.log("📈 Detectado evento de plantilla actualizada");
        actualizarMercado();
    });
    
    // Detectar cuando se vuelve a la página (desde otra pestaña)
    window.addEventListener('focus', function() {
        console.log("🔄 Página enfocada - Verificando actualizaciones");
        actualizarMercado();
    });
    
    // Detectar cuando la página se vuelve visible
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            console.log("👁️ Página visible - Verificando actualizaciones");
            actualizarMercado();
        }
    });
    
    // Inicializar la interfaz
    if (mercadoTransferencias.length > 0) {
        llenarFiltroClub();
        mostrarJugadores();
        
        console.log("💼 Sistema de transferencias inicializado correctamente");
        console.log(`📊 Jugadores disponibles: ${mercadoTransferencias.filter(j => j.disponibleParaCompra).length}`);
        console.log("📝 Comandos disponibles en consola:");
        console.log("   - sistemaTransferencias.mostrarMercado() // Ver jugadores disponibles");
        console.log("   - sistemaTransferencias.actualizarMercado() // Refrescar el mercado");
        console.log("   - miEquipoInfo.mostrarInfo() // Ver información del equipo");
    } else {
        console.error("❌ No se pudieron cargar jugadores para el mercado");
    }
});
