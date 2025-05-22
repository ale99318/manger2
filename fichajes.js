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
                disponibleParaCompra: true
            };
        });
    
    // Función para obtener descripción del estado
    function obtenerDescripcionEstado(estado) {
        switch (estado) {
            case 'disponible': return 'Precio negociable';
            case 'clausula': return 'Cláusula de rescisión';
            case 'libre': return 'Agente libre';
            default: return 'No disponible';
        }
    }
    
    // Función para realizar transferencia
    function realizarTransferencia(jugadorId) {
        const jugador = mercadoTransferencias.find(j => j.id === jugadorId);
        
        if (!jugador || !jugador.disponibleParaCompra) {
            console.log("❌ Jugador no disponible para transferencia");
            return false;
        }
        
        const costoTotal = jugador.precioTransferencia + jugador.bonusFirma;
        
        if (window.miEquipoInfo.presupuesto < costoTotal) {
            console.log(`❌ Presupuesto insuficiente. Necesitas ${formatearPrecio(costoTotal)}, tienes ${formatearPrecio(window.miEquipoInfo.presupuesto)}`);
            return false;
        }
        
        // Realizar la transferencia
        const nuevoPresupuesto = window.miEquipoInfo.presupuesto - costoTotal;
        window.miEquipoInfo.presupuesto = nuevoPresupuesto;
        window.miEquipoInfo.presupuestoFormateado = formatearPrecio(nuevoPresupuesto);
        
        // Guardar nuevo presupuesto
        localStorage.setItem(`presupuesto_${equipoNombre}`, nuevoPresupuesto);
        
        // Actualizar DOM si existe
        if (elementoPresupuesto) {
            elementoPresupuesto.textContent = formatearPrecio(nuevoPresupuesto);
        }
        
        // Marcar jugador como no disponible
        jugador.disponibleParaCompra = false;
        jugador.club = equipoNombre;
        
        console.log("✅ ¡Transferencia exitosa!");
        console.log(`Jugador: ${jugador.nombre}`);
        console.log(`Costo: ${formatearPrecio(costoTotal)}`);
        console.log(`Nuevo presupuesto: ${formatearPrecio(nuevoPresupuesto)}`);
        
        return true;
    }
    
    // Función para mostrar mercado
    function mostrarMercado(filtros = {}) {
        console.log("=== MERCADO DE TRANSFERENCIAS ===");
        
        let jugadoresFiltrados = mercadoTransferencias.filter(j => j.disponibleParaCompra);
        
        // Aplicar filtros
        if (filtros.posicion) {
            jugadoresFiltrados = jugadoresFiltrados.filter(j => j.posicion === filtros.posicion);
        }
        
        if (filtros.presupuestoMaximo) {
            jugadoresFiltrados = jugadoresFiltrados.filter(j => 
                (j.precioTransferencia + j.bonusFirma) <= filtros.presupuestoMaximo
            );
        }
        
        if (filtros.club) {
            jugadoresFiltrados = jugadoresFiltrados.filter(j => j.club === filtros.club);
        }
        
        jugadoresFiltrados.forEach(jugador => {
            const costoTotal = jugador.precioTransferencia + jugador.bonusFirma;
            
            console.log(`\n📋 ${jugador.nombre} (${jugador.edad} años) - ID: ${jugador.id}`);
            console.log(`   Club: ${jugador.club} | Posición: ${jugador.posicion}`);
            console.log(`   Overall: ${jugador.general} | Potencial: ${jugador.potencial}`);
            console.log(`   Estado: ${obtenerDescripcionEstado(jugador.estadoTransferencia)}`);
            console.log(`   💰 Precio: ${formatearPrecio(jugador.precioTransferencia)}`);
            console.log(`   💼 Bonus firma: ${formatearPrecio(jugador.bonusFirma)}`);
            console.log(`   💵 Costo total: ${formatearPrecio(costoTotal)}`);
            console.log(`   📈 Sueldo: ${formatearPrecio(jugador.sueldo)}/mes`);
            
            if (jugador.bonusGol > 0) {
                console.log(`   ⚽ Bonus por gol: ${formatearPrecio(jugador.bonusGol)}`);
            }
            
            if (jugador.bonusArcoEnCero > 0) {
                console.log(`   🥅 Bonus arco en cero: ${formatearPrecio(jugador.bonusArcoEnCero)}`);
            }
        });
        
        console.log("\n================================");
        console.log(`Total jugadores disponibles: ${jugadoresFiltrados.length}`);
    }
    
    // Función para buscar jugador por nombre
    function buscarJugador(nombre) {
        const jugador = mercadoTransferencias.find(j => 
            j.nombre.toLowerCase().includes(nombre.toLowerCase()) && j.disponibleParaCompra
        );
        
        if (jugador) {
            const costoTotal = jugador.precioTransferencia + jugador.bonusFirma;
            console.log(`\n🔍 Jugador encontrado:`);
            console.log(`📋 ${jugador.nombre} (ID: ${jugador.id})`);
            console.log(`💰 Costo total: ${formatearPrecio(costoTotal)}`);
            console.log(`Estado: ${obtenerDescripcionEstado(jugador.estadoTransferencia)}`);
            return jugador;
        } else {
            console.log(`❌ No se encontró jugador disponible con el nombre: ${nombre}`);
            return null;
        }
    }
    
    // Crear sistema global de transferencias
    window.sistemaTransferencias = {
        mercado: mercadoTransferencias,
        mostrarMercado: mostrarMercado,
        buscarJugador: buscarJugador,
        realizarTransferencia: realizarTransferencia,
        formatearPrecio: formatearPrecio
    };
    
    console.log("💼 Sistema de transferencias inicializado");
    console.log(`📊 Jugadores disponibles: ${mercadoTransferencias.length}`);
    console.log("📝 Usa sistemaTransferencias.mostrarMercado() para ver jugadores");
});
