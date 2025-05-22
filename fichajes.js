// Sistema de transferencias y mercado de jugadores
document.addEventListener('DOMContentLoaded', function() {
    
    // Verificar que existan los datos necesarios
    if (!window.jugadores) {
        console.error("❌ No se encontraron datos de jugadores");
        return;
    }
    
    if (!window.miEquipoInfo) {
        console.error("❌ No se encontró información del equipo");
        return;
    }
    
    // Generar estados de transferencia para cada jugador
    function generarEstadoTransferencia(jugador) {
        const estados = ['disponible', 'clausula', 'libre'];
        const probabilidades = [0.6, 0.3, 0.1]; // 60% disponible, 30% cláusula, 10% libre
        
        const random = Math.random();
        let estadoSeleccionado;
        
        if (random < probabilidades[0]) {
            estadoSeleccionado = 'disponible';
        } else if (random < probabilidades[0] + probabilidades[1]) {
            estadoSeleccionado = 'clausula';
        } else {
            estadoSeleccionado = 'libre';
        }
        
        return estadoSeleccionado;
    }
    
    // Calcular precio de transferencia según el estado
    function calcularPrecioTransferencia(jugador, estado) {
        const valorBase = jugador.valor;
        
        switch (estado) {
            case 'disponible':
                // Precio negociable entre 80% y 120% del valor
                return Math.floor(valorBase * (0.8 + Math.random() * 0.4));
            
            case 'clausula':
                // Cláusula de rescisión (150% - 200% del valor)
                return Math.floor(valorBase * (1.5 + Math.random() * 0.5));
            
            case 'libre':
                // Solo costos de firma (5% - 15% del valor)
                return Math.floor(valorBase * (0.05 + Math.random() * 0.1));
            
            default:
                return valorBase;
        }
    }
    
    // Generar bonus por rendimiento
    function generarBonus(jugador) {
        const bonusBase = jugador.sueldo * 0.1; // 10% del sueldo base
        
        return {
            gol: jugador.posicion === "Delantero" ? Math.floor(bonusBase * (0.5 + Math.random() * 0.5)) : 0,
            arcoEnCero: jugador.posicion === "Defensa" ? Math.floor(bonusBase * (0.3 + Math.random() * 0.3)) : 0,
            firma: Math.floor(bonusBase * (0.2 + Math.random() * 0.8))
        };
    }
    
    // Crear mercado de transferencias
    const mercadoTransferencias = window.jugadores.map(jugador => {
        const estadoTransferencia = generarEstadoTransferencia(jugador);
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
    
    // Función para formatear precio
    function formatearPrecio(precio) {
        if (precio >= 1000000) {
            return `$${(precio / 1000000).toFixed(1)}M`;
        } else if (precio >= 1000) {
            return `$${(precio / 1000).toFixed(0)}K`;
        } else {
            return `$${precio}`;
        }
    }
    
    // Función para obtener descripción del estado
    function obtenerDescripcionEstado(estado) {
        switch (estado) {
            case 'disponible':
                return 'Precio negociable';
            case 'clausula':
                return 'Cláusula de rescisión';
            case 'libre':
                return 'Agente libre';
            default:
                return 'No disponible';
        }
    }
    
    // Función para realizar transferencia
    function realizarTransferencia(jugadorId) {
        const jugador = mercadoTransferencias.find(j => j.id === jugadorId);
        
        if (!jugador || !jugador.disponibleParaCompra) {
            console.log("❌ Jugador no disponible para transferencia");
            return false;
        }
        
        const presupuestoActual = window.miEquipoInfo.presupuesto;
        const costoTotal = jugador.precioTransferencia + jugador.bonusFirma;
        
        if (presupuestoActual < costoTotal) {
            console.log(`❌ Presupuesto insuficiente. Necesitas ${formatearPrecio(costoTotal)}, tienes ${formatearPrecio(presupuestoActual)}`);
            return false;
        }
        
        // Realizar la transferencia
        const nuevoPresupuesto = presupuestoActual - costoTotal;
        window.miEquipoInfo.presupuesto = nuevoPresupuesto;
        
        // Guardar nuevo presupuesto
        localStorage.setItem(`presupuesto_${window.miEquipoInfo.nombre}`, nuevoPresupuesto);
        
        // Marcar jugador como no disponible
        jugador.disponibleParaCompra = false;
        jugador.club = window.miEquipoInfo.nombre;
        
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
            
            console.log(`\n📋 ${jugador.nombre} (${jugador.edad} años)`);
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
    
    // Crear sistema global
    window.sistemaTransferencias = {
        mercado: mercadoTransferencias,
        mostrarMercado: mostrarMercado,
        buscarJugador: buscarJugador,
        realizarTransferencia: realizarTransferencia,
        formatearPrecio: formatearPrecio
    };
    
    console.log("💼 Sistema de transferencias inicializado");
    console.log("📝 Usa window.sistemaTransferencias.mostrarMercado() para ver jugadores disponibles");
    console.log("🔍 Usa window.sistemaTransferencias.buscarJugador('nombre') para buscar");
    console.log("💰 Usa window.sistemaTransferencias.realizarTransferencia(id) para fichar");
});
