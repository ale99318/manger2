// Sistema simple para mostrar equipo y presupuesto + Sistema de transferencias con negociación
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
        
        // Método para mostrar información
        mostrarInfo: function() {
            console.log(`Equipo: ${this.nombre} | Presupuesto: ${this.presupuestoFormateado}`);
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
    
    // Crear mercado de transferencias (excluyendo jugadores del equipo actual)
    const mercadoTransferencias = window.jugadores
        .filter(jugador => jugador.club !== equipoNombre)
        .map(jugador => {
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
                disponibleParaCompra: true,
                sueldoDeseado: Math.floor(jugador.sueldo * (0.8 + Math.random() * 0.6)) // 80-140% del sueldo actual
            };
        });
    
    // Variables para los elementos del DOM
    const playersGrid = document.getElementById('playersGrid');
    const positionFilter = document.getElementById('positionFilter');
    const priceFilter = document.getElementById('priceFilter');
    const priceValue = document.getElementById('priceValue');
    const clubFilter = document.getElementById('clubFilter');
    const transferModal = document.getElementById('transferModal');
    const negotiationModal = document.getElementById('negotiationModal');
    const transferHistory = document.getElementById('transferHistory');
    
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
                <button class="btn-transfer" data-player-id="${jugador.id}">
                    Iniciar Negociación
                </button>
            </div>
        `;
        
        return tarjeta;
    }
    
    // Mostrar jugadores en la interfaz
    function mostrarJugadores(jugadoresToShow = mercadoTransferencias) {
        if (!playersGrid) return;
        
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
        document.querySelectorAll('.btn-transfer').forEach(btn => {
            btn.addEventListener('click', function() {
                const jugadorId = parseInt(this.dataset.playerId);
                mostrarModalNegociacion(jugadorId);
            });
        });
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
    
    // Mostrar modal de negociación
    function mostrarModalNegociacion(jugadorId) {
        const jugador = mercadoTransferencias.find(j => j.id === jugadorId);
        if (!jugador) return;
        
        // Crear modal de negociación si no existe
        if (!document.getElementById('negotiationModal')) {
            crearModalNegociacion();
        }
        
        const modal = document.getElementById('negotiationModal');
        
        // Llenar datos del jugador
        document.getElementById('negPlayerName').textContent = jugador.nombre;
        document.getElementById('negPlayerPosition').textContent = jugador.posicion;
        document.getElementById('negPlayerClub').textContent = jugador.club;
        document.getElementById('negPlayerOverall').textContent = jugador.general;
        document.getElementById('negTransferPrice').textContent = formatearPrecio(jugador.precioTransferencia);
        document.getElementById('negCurrentSalary').textContent = formatearPrecio(jugador.sueldo);
        document.getElementById('negDesiredSalary').textContent = formatearPrecio(jugador.sueldoDeseado);
        
        // Resetear formulario
        document.getElementById('contractYears').value = '2';
        document.getElementById('offerSalary').value = jugador.sueldoDeseado;
        document.getElementById('salaryValue').textContent = formatearPrecio(jugador.sueldoDeseado);
        
        // Mostrar modal
        modal.style.display = 'block';
        
        // Event listeners
        document.getElementById('startNegotiation').onclick = () => iniciarNegociacion(jugadorId);
        document.getElementById('cancelNegotiation').onclick = () => cerrarModalNegociacion();
        document.querySelector('#negotiationModal .close').onclick = () => cerrarModalNegociacion();
        
        // Actualizar valor del sueldo en tiempo real
        document.getElementById('offerSalary').oninput = function() {
            document.getElementById('salaryValue').textContent = formatearPrecio(parseInt(this.value));
        };
    }
    
    // Crear modal de negociación
    function crearModalNegociacion() {
        const modalHTML = `
            <div id="negotiationModal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Negociación de Transferencia</h2>
                    
                    <div class="player-info">
                        <h3 id="negPlayerName"></h3>
                        <p><strong>Posición:</strong> <span id="negPlayerPosition"></span></p>
                        <p><strong>Club Actual:</strong> <span id="negPlayerClub"></span></p>
                        <p><strong>Overall:</strong> <span id="negPlayerOverall"></span></p>
                        <p><strong>Precio Transferencia:</strong> <span id="negTransferPrice"></span></p>
                        <p><strong>Sueldo Actual:</strong> <span id="negCurrentSalary"></span></p>
                        <p><strong>Sueldo Deseado:</strong> <span id="negDesiredSalary"></span></p>
                    </div>
                    
                    <div class="negotiation-form">
                        <h4>Tu Oferta:</h4>
                        <div class="form-group">
                            <label for="contractYears">Duración del Contrato:</label>
                            <select id="contractYears">
                                <option value="1">1 año</option>
                                <option value="2" selected>2 años</option>
                                <option value="3">3 años</option>
                                <option value="4">4 años</option>
                                <option value="5">5 años</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="offerSalary">Sueldo Ofrecido:</label>
                            <input type="range" id="offerSalary" min="50000" max="5000000" step="10000">
                            <span id="salaryValue"></span>
                        </div>
                        
                        <div class="negotiation-buttons">
                            <button id="startNegotiation" class="btn-confirm">Enviar Oferta</button>
                            <button id="cancelNegotiation" class="btn-cancel">Cancelar</button>
                        </div>
                    </div>
                    
                    <div id="negotiationResult" class="negotiation-result" style="display: none;"></div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // Cerrar modal de negociación
    function cerrarModalNegociacion() {
        const modal = document.getElementById('negotiationModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // Iniciar proceso de negociación
    function iniciarNegociacion(jugadorId) {
        const jugador = mercadoTransferencias.find(j => j.id === jugadorId);
        if (!jugador) return;
        
        const años = parseInt(document.getElementById('contractYears').value);
        const sueldoOfrecido = parseInt(document.getElementById('offerSalary').value);
        const costoTotal = jugador.precioTransferencia + jugador.bonusFirma + (sueldoOfrecido * años);
        
        // Verificar presupuesto
        if (window.miEquipoInfo.presupuesto < costoTotal) {
            mostrarResultadoNegociacion(`❌ Presupuesto insuficiente. Necesitas ${formatearPrecio(costoTotal)}, tienes ${formatearPrecio(window.miEquipoInfo.presupuesto)}`, 'error');
            return;
        }
        
        // Simular respuesta del club
        const respuestaClub = simularRespuestaClub(jugador, sueldoOfrecido, años);
        
        if (!respuestaClub.acepta) {
            mostrarResultadoNegociacion(`❌ El ${jugador.club} rechazó la oferta. ${respuestaClub.razon}`, 'error');
            return;
        }
        
        // Si el club acepta, simular respuesta del jugador
        const respuestaJugador = simularRespuestaJugador(jugador, sueldoOfrecido, años);
        
        if (!respuestaJugador.acepta) {
            mostrarResultadoNegociacion(`❌ ${jugador.nombre} rechazó la oferta. ${respuestaJugador.razon}`, 'error');
            return;
        }
        
        // ¡Transferencia exitosa!
        mostrarResultadoNegociacion(`✅ ¡Transferencia exitosa! ${jugador.nombre} ha aceptado la oferta.`, 'success');
        
        // Procesar la transferencia
        setTimeout(() => {
            realizarTransferencia(jugadorId, años, sueldoOfrecido, costoTotal);
        }, 2000);
    }
    
    // Simular respuesta del club
    function simularRespuestaClub(jugador, sueldoOfrecido, años) {
        const probabilidadBase = 0.7; // 70% de probabilidad base
        const factorPrecio = jugador.precioTransferencia >= jugador.valor ? 0.2 : -0.1;
        const factorEstado = jugador.estadoTransferencia === 'clausula' ? 0.3 : 0;
        
        const probabilidadFinal = probabilidadBase + factorPrecio + factorEstado;
        const acepta = Math.random() < probabilidadFinal;
        
        const razones = [
            "Consideran que la oferta es insuficiente",
            "El jugador es clave para sus planes",
            "Esperan una mejor oferta de otro club",
            "No quieren vender en este momento"
        ];
        
        return {
            acepta: acepta,
            razon: acepta ? "" : razones[Math.floor(Math.random() * razones.length)]
        };
    }
    
    // Simular respuesta del jugador
    function simularRespuestaJugador(jugador, sueldoOfrecido, años) {
        const ratioSueldo = sueldoOfrecido / jugador.sueldoDeseado;
        const probabilidadBase = 0.6; // 60% probabilidad base
        
        let factorSueldo = 0;
        if (ratioSueldo >= 1.2) factorSueldo = 0.3;      // Sueldo muy bueno
        else if (ratioSueldo >= 1.0) factorSueldo = 0.1; // Sueldo bueno
        else if (ratioSueldo >= 0.8) factorSueldo = -0.1; // Sueldo bajo
        else factorSueldo = -0.3;                         // Sueldo muy bajo
        
        const factorContrato = años >= 3 ? 0.1 : -0.05; // Prefiere contratos largos
        const probabilidadFinal = probabilidadBase + factorSueldo + factorContrato;
        
        const acepta = Math.random() < probabilidadFinal;
        
        const razones = [
            "El sueldo ofrecido es muy bajo para sus expectativas",
            "Prefiere quedarse en su club actual",
            "Está esperando ofertas de otros equipos",
            "No está convencido del proyecto deportivo",
            "Considera que el contrato es muy corto"
        ];
        
        return {
            acepta: acepta,
            razon: acepta ? "" : razones[Math.floor(Math.random() * razones.length)]
        };
    }
    
    // Mostrar resultado de negociación
    function mostrarResultadoNegociacion(mensaje, tipo) {
        const resultDiv = document.getElementById('negotiationResult');
        resultDiv.innerHTML = `<p class="${tipo}">${mensaje}</p>`;
        resultDiv.style.display = 'block';
    }
    
    // Mostrar modal de confirmación (versión simplificada)
    function mostrarModalConfirmacion(jugadorId) {
        const jugador = mercadoTransferencias.find(j => j.id === jugadorId);
        if (!jugador || !transferModal) return;
        
        const costoTotal = jugador.precioTransferencia + jugador.bonusFirma;
        const presupuestoDespues = window.miEquipoInfo.presupuesto - costoTotal;
        
        // Llenar datos del modal
        document.getElementById('modalPlayerName').textContent = jugador.nombre;
        document.getElementById('modalPlayerPosition').textContent = jugador.posicion;
        document.getElementById('modalPlayerClub').textContent = jugador.club;
        document.getElementById('modalPlayerOverall').textContent = jugador.general;
        document.getElementById('modalTransferPrice').textContent = formatearPrecio(costoTotal);
        document.getElementById('modalBudgetAfter').textContent = formatearPrecio(presupuestoDespues);
        
        // Mostrar modal
        transferModal.style.display = 'block';
        
        // Event listeners para el modal
        document.getElementById('confirmTransfer').onclick = () => {
            realizarTransferencia(jugadorId, 2, jugador.sueldo, costoTotal);
        };
        document.getElementById('cancelTransfer').onclick = () => cerrarModal();
        document.querySelector('.close').onclick = () => cerrarModal();
    }
    
    // Cerrar modal
    function cerrarModal() {
        if (transferModal) {
            transferModal.style.display = 'none';
        }
    }
    
    // Realizar transferencia (versión actualizada)
    function realizarTransferencia(jugadorId, años = 2, sueldo = null, costoTotal = null) {
        const jugador = mercadoTransferencias.find(j => j.id === jugadorId);
        
        if (!jugador || !jugador.disponibleParaCompra) {
            alert("❌ Jugador no disponible para transferencia");
            return false;
        }
        
        // Calcular costo si no se proporciona
        if (!costoTotal) {
            costoTotal = jugador.precioTransferencia + jugador.bonusFirma;
            if (sueldo) {
                costoTotal += sueldo * años;
            }
        }
        
        if (window.miEquipoInfo.presupuesto < costoTotal) {
            alert(`❌ Presupuesto insuficiente. Necesitas ${formatearPrecio(costoTotal)}, tienes ${formatearPrecio(window.miEquipoInfo.presupuesto)}`);
            return false;
        }
        
        // Realizar la transferencia
        const nuevoPresupuesto = window.miEquipoInfo.presupuesto - costoTotal;
        window.miEquipoInfo.presupuesto = nuevoPresupuesto;
        window.miEquipoInfo.presupuestoFormateado = formatearPrecio(nuevoPresupuesto);
        
        // Guardar nuevo presupuesto
        localStorage.setItem(`presupuesto_${equipoNombre}`, nuevoPresupuesto);
        
        // Actualizar DOM
        if (elementoPresupuesto) {
            elementoPresupuesto.textContent = formatearPrecio(nuevoPresupuesto);
        }
        
        // Marcar jugador como no disponible
        jugador.disponibleParaCompra = false;
        jugador.club = equipoNombre;
        
        // Agregar al historial con detalles del contrato
        agregarAlHistorial(jugador, costoTotal, años, sueldo);
        
        // Cerrar modales y actualizar vista
        cerrarModal();
        cerrarModalNegociacion();
        aplicarFiltros();
        
        const mensajeContrato = sueldo ? ` con contrato de ${años} años por ${formatearPrecio(sueldo)}/año` : '';
        alert(`✅ ¡Transferencia exitosa! Has fichado a ${jugador.nombre} por ${formatearPrecio(costoTotal)}${mensajeContrato}`);
        
        return true;
    }
    
    // Agregar transferencia al historial (versión actualizada)
    function agregarAlHistorial(jugador, costo, años = 2, sueldo = null) {
        if (!transferHistory) return;
        
        const detalleContrato = sueldo ? `<br><small>${años} años × ${formatearPrecio(sueldo)}/año</small>` : '';
        
        const entrada = document.createElement('div');
        entrada.className = 'transfer-entry';
        entrada.innerHTML = `
            <span class="transfer-player">${jugador.nombre}</span>
            <span class="transfer-from">desde ${jugador.club}</span>
            <span class="transfer-cost">${formatearPrecio(costo)}${detalleContrato}</span>
        `;
        
        transferHistory.insertBefore(entrada, transferHistory.firstChild);
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
    
    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target === transferModal) {
            cerrarModal();
        }
        if (event.target === document.getElementById('negotiationModal')) {
            cerrarModalNegociacion();
        }
    });
    
    // Crear sistema global de transferencias (para consola)
    window.sistemaTransferencias = {
        mercado: mercadoTransferencias,
        mostrarMercado: function() {
            console.log("=== MERCADO DE TRANSFERENCIAS ===");
            mercadoTransferencias.filter(j => j.disponibleParaCompra).forEach(jugador => {
                const costoTotal = jugador.precioTransferencia + jugador.bonusFirma;
                console.log(`📋 ${jugador.nombre} (ID: ${jugador.id}) - ${formatearPrecio(costoTotal)} - Sueldo deseado: ${formatearPrecio(jugador.sueldoDeseado)}`);
            });
        },
        buscarJugador: function(nombre) {
            return mercadoTransferencias.find(j => 
                j.nombre.toLowerCase().includes(nombre.toLowerCase()) && j.disponibleParaCompra
            );
        },
        negociar: function(jugadorId, años, sueldo) {
            console.log(`Iniciando negociación para jugador ID: ${jugadorId}, ${años} años, ${formatearPrecio(sueldo)}/año`);
            return iniciarNegociacion(jugadorId);
        },
        realizarTransferencia: realizarTransferencia,
        formatearPrecio: formatearPrecio
    };
    
    // Inicializar la interfaz
    llenarFiltroClub();
    mostrarJugadores();
    
    console.log("💼 Sistema de transferencias con negociación inicializado");
    console.log(`📊 Jugadores disponibles: ${mercadoTransferencias.filter(j => j.disponibleParaCompra).length}`);
    console.log("📝 Usa sistemaTransferencias.mostrarMercado() para ver jugadores en consola");
    console.log("🤝 Usa sistemaTransferencias.negociar(jugadorId, años, sueldo) para negociar desde consola");
});
