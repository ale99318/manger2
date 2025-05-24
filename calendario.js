// Inicialización del calendario
document.addEventListener("DOMContentLoaded", function() {
    inicializarFecha();
    actualizarDisplay();
    verificarContratos();
    evaluarRetiros(); // NUEVO: Evaluar retiros al cargar
    
    // Event listeners para botones
    document.getElementById("avanzar-dia").addEventListener("click", () => avanzarTiempo(1));
    document.getElementById("avanzar-semana").addEventListener("click", () => avanzarTiempo(7));
    document.getElementById("avanzar-mes").addEventListener("click", () => avanzarTiempo(30));
});

// Función para inicializar la fecha del juego
function inicializarFecha() {
    let fechaJuego = localStorage.getItem("fechaJuego");
    
    if (!fechaJuego) {
        // Primera vez: establecer fecha inicial
        const fechaInicio = new Date("2025-01-01");
        localStorage.setItem("fechaJuego", fechaInicio.toISOString());
        console.log("Fecha del juego inicializada: 01/01/2025");
    }
}

// Función para obtener la fecha actual del juego
function obtenerFechaJuego() {
    const fechaString = localStorage.getItem("fechaJuego");
    return new Date(fechaString);
}

// === SISTEMA DE RETIROS (COPIADO DEL MERCADO) ===
function evaluarRetiro(jugador) {
    // Retiro forzoso por edad
    if (jugador.edad >= 45) {
        jugador.retirado = true;
        jugador.motivoRetiro = "Edad máxima alcanzada";
        jugador.fechaRetiro = obtenerFechaJuego().toISOString();
        return true;
    }
    
    // Posible retiro desde los 36 años en adelante
    if (jugador.edad >= 36) {
        const probabilidadBase = Math.pow((jugador.edad - 35), 2) / 100; // crece con la edad
        const suerte = Math.random();
        
        if (suerte < probabilidadBase) {
            jugador.retirado = true;
            jugador.motivoRetiro = "Retiro voluntario por edad";
            jugador.fechaRetiro = obtenerFechaJuego().toISOString();
            return true;
        }
    }
    
    // Retiro por lesión mortal
    if (jugador.ultimaLesion && jugador.ultimaLesion.gravedad === "mortal") {
        jugador.retirado = true;
        jugador.motivoRetiro = "Lesión mortal";
        jugador.fechaRetiro = obtenerFechaJuego().toISOString();
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
        jugador.fechaRetiro = obtenerFechaJuego().toISOString();
        return true;
    }
    
    return false; // No se retira
}

// NUEVA FUNCIÓN: Evaluar retiros de todos los jugadores
function evaluarRetiros() {
    let jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
    let jugadoresRetirados = [];
    let huboRetiros = false;
    
    console.log("🔍 Evaluando retiros de jugadores...");
    
    jugadores.forEach(jugador => {
        if (!jugador.retirado) {
            if (evaluarRetiro(jugador)) {
                huboRetiros = true;
                jugadoresRetirados.push({
                    nombre: jugador.nombre,
                    posicion: jugador.posicion,
                    club: jugador.club,
                    edad: jugador.edad,
                    motivo: jugador.motivoRetiro,
                    fechaRetiro: jugador.fechaRetiro
                });
                console.log(`🏃‍♂️ RETIRO: ${jugador.nombre} (${jugador.edad} años) - ${jugador.motivoRetiro}`);
            }
        }
    });
    
    if (huboRetiros) {
        localStorage.setItem("jugadores", JSON.stringify(jugadores));
        guardarHistorialRetiros(jugadoresRetirados);
        mostrarRetirosRecientes(jugadoresRetirados);
        console.log(`✅ ${jugadoresRetirados.length} jugador(es) se retiró/retiraron`);
    } else {
        console.log("✅ No hubo retiros en esta evaluación");
    }
    
    return jugadoresRetirados;
}

// NUEVA FUNCIÓN: Guardar historial de retiros
function guardarHistorialRetiros(jugadoresRetirados) {
    let historial = JSON.parse(localStorage.getItem('historialRetiros') || '[]');
    
    jugadoresRetirados.forEach(jugador => {
        historial.unshift(jugador); // Agregar al inicio
    });
    
    // Mantener solo los últimos 100 retiros
    if (historial.length > 100) {
        historial = historial.slice(0, 100);
    }
    
    localStorage.setItem('historialRetiros', JSON.stringify(historial));
}

// NUEVA FUNCIÓN: Mostrar retiros recientes en el DOM
function mostrarRetirosRecientes(retirosRecientes) {
    const contenedor = document.getElementById("retiros-recientes");
    const lista = document.getElementById("lista-retiros");
    
    if (contenedor && lista && retirosRecientes.length > 0) {
        contenedor.style.display = "block";
        lista.innerHTML = "";
        
        retirosRecientes.forEach(retiro => {
            const div = document.createElement("div");
            div.innerHTML = `
                <p><strong>${retiro.nombre}</strong> - ${retiro.posicion}</p>
                <p>🏃‍♂️ SE RETIRÓ - ${retiro.motivo}</p>
                <p>Edad: ${retiro.edad} años | Ex-Club: ${retiro.club}</p>
                <hr>
            `;
            lista.appendChild(div);
        });
    } else if (contenedor) {
        contenedor.style.display = "none";
    }
}

// FUNCIÓN MODIFICADA: Avanzar el tiempo CON evaluación de retiros
function avanzarTiempo(dias) {
    const fechaActual = obtenerFechaJuego();
    fechaActual.setDate(fechaActual.getDate() + dias);
    
    localStorage.setItem("fechaJuego", fechaActual.toISOString());
    
    console.log(`⏰ Tiempo avanzado ${dias} día(s). Nueva fecha: ${fechaActual.toLocaleDateString()}`);
    
    // ORDEN IMPORTANTE:
    // 1. Primero evaluar retiros
    const retirosRecientes = evaluarRetiros();
    
    // 2. Luego verificar contratos
    verificarContratos();
    
    // 3. Actualizar display
    actualizarDisplay();
    
    // 4. Notificar cambio
    notificarCambioFecha();
    
    // 5. Mostrar resumen si hubo cambios importantes
    if (retirosRecientes.length > 0) {
        console.log(`📊 RESUMEN: ${retirosRecientes.length} retiro(s) procesado(s)`);
    }
}

// **FUNCIÓN MODIFICADA: Notificar cambio de fecha**
function notificarCambioFecha() {
    // Crear evento personalizado para notificar cambio de fecha
    const evento = new CustomEvent('fechaCambiada', {
        detail: { 
            fecha: obtenerFechaJuego(),
            timestamp: Date.now() 
        }
    });
    
    // Disparar el evento
    window.dispatchEvent(evento);
    
    console.log('📡 Evento de cambio de fecha disparado');
}

// Función para actualizar el display de fecha
function actualizarDisplay() {
    const fecha = obtenerFechaJuego();
    const opciones = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
    document.getElementById("fecha-display").textContent = fechaFormateada;
}

// **FUNCIÓN MODIFICADA: Verificar contratos y sincronizar con plantilla**
function verificarContratos() {
    let jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
    const fechaActual = obtenerFechaJuego();
    
    let contratosVencidos = [];
    let contratosPorVencer = [];
    let contratosActivos = 0;
    let contratosSinFecha = 0;
    let jugadoresEliminados = [];
    
    console.log("📋 Verificando contratos...");
    
    // Procesar cada jugador (solo los no retirados)
    for (let i = jugadores.length - 1; i >= 0; i--) {
        const jugador = jugadores[i];
        
        // Saltar jugadores retirados
        if (jugador.retirado) {
            continue;
        }
        
        if (jugador.contrato && jugador.contrato.fechaVencimiento) {
            const fechaVencimiento = new Date(jugador.contrato.fechaVencimiento);
            const diasParaVencer = Math.ceil((fechaVencimiento - fechaActual) / (1000 * 60 * 60 * 24));
            
            if (diasParaVencer < 0) {
                // Contrato vencido - eliminar jugador
                contratosVencidos.push({
                    jugador: jugador,
                    diasVencido: Math.abs(diasParaVencer)
                });
                
                // Guardar información para historial
                jugadoresEliminados.push({
                    nombre: jugador.nombre,
                    posicion: jugador.posicion,
                    club: jugador.club,
                    fechaEliminacion: fechaActual.toISOString(),
                    motivo: "Contrato vencido"
                });
                
                // Eliminar jugador de la plantilla
                jugadores.splice(i, 1);
                
                console.log(`❌ Jugador eliminado por contrato vencido: ${jugador.nombre}`);
                
            } else if (diasParaVencer <= 30) {
                // Contrato por vencer en 30 días
                contratosPorVencer.push({
                    jugador: jugador,
                    diasRestantes: diasParaVencer
                });
                contratosActivos++;
            } else {
                contratosActivos++;
            }
        } else if (jugador.contrato && typeof jugador.contrato === 'number') {
            // Manejar contratos con formato antiguo (número de meses)
            const fechaInicial = new Date("2025-01-01");
            const fechaVencimiento = new Date(fechaInicial);
            fechaVencimiento.setMonth(fechaVencimiento.getMonth() + jugador.contrato);
            
            const diasParaVencer = Math.ceil((fechaVencimiento - fechaActual) / (1000 * 60 * 60 * 24));
            
            if (diasParaVencer < 0) {
                // Contrato vencido - eliminar jugador
                contratosVencidos.push({
                    jugador: jugador,
                    diasVencido: Math.abs(diasParaVencer)
                });
                
                jugadoresEliminados.push({
                    nombre: jugador.nombre,
                    posicion: jugador.posicion,
                    club: jugador.club,
                    fechaEliminacion: fechaActual.toISOString(),
                    motivo: "Contrato vencido"
                });
                
                jugadores.splice(i, 1);
                console.log(`❌ Jugador eliminado por contrato vencido: ${jugador.nombre}`);
                
            } else if (diasParaVencer <= 30) {
                contratosPorVencer.push({
                    jugador: jugador,
                    diasRestantes: diasParaVencer
                });
                contratosActivos++;
            } else {
                contratosActivos++;
            }
        } else if (jugador.contrato) {
            contratosSinFecha++;
        }
    }
    
    // Si se eliminaron jugadores, actualizar localStorage y historial
    if (jugadoresEliminados.length > 0) {
        localStorage.setItem("jugadores", JSON.stringify(jugadores));
        guardarHistorialEliminados(jugadoresEliminados);
        console.log(`📝 ${jugadoresEliminados.length} jugador(es) eliminado(s) por contrato vencido`);
    }
    
    // Actualizar información general
    actualizarInfoContratos(contratosActivos, contratosSinFecha, jugadores.length);
    
    // Mostrar contratos vencidos
    mostrarContratosVencidos(contratosVencidos);
    
    // Mostrar contratos por vencer
    mostrarContratosPorVencer(contratosPorVencer);
}

// Función para actualizar información general de contratos
function actualizarInfoContratos(activos, sinFecha, total) {
    const infoElement = document.getElementById("contratos-info");
    
    if (infoElement) {
        // Contar jugadores retirados
        const jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
        const retirados = jugadores.filter(j => j.retirado).length;
        
        infoElement.innerHTML = `
            <p><strong>Total de jugadores:</strong> ${total}</p>
            <p><strong>Jugadores retirados:</strong> ${retirados}</p>
            <p><strong>Contratos activos:</strong> ${activos}</p>
            <p><strong>Contratos sin fecha:</strong> ${sinFecha}</p>
        `;
    }
}

// Función para mostrar contratos vencidos
function mostrarContratosVencidos(contratosVencidos) {
    const contenedor = document.getElementById("contratos-vencidos");
    const lista = document.getElementById("lista-vencidos");
    
    if (contenedor && lista) {
        if (contratosVencidos.length > 0) {
            contenedor.style.display = "block";
            lista.innerHTML = "";
            
            contratosVencidos.forEach(item => {
                const div = document.createElement("div");
                div.innerHTML = `
                    <p><strong>${item.jugador.nombre}</strong> - ${item.jugador.posicion}</p>
                    <p>🚫 ELIMINADO - Contrato vencido hace ${item.diasVencido} día(s)</p>
                    <p>Ex-Club: ${item.jugador.club}</p>
                    <hr>
                `;
                lista.appendChild(div);
            });
        } else {
            contenedor.style.display = "none";
        }
    }
}

// Función para mostrar contratos por vencer
function mostrarContratosPorVencer(contratosPorVencer) {
    const contenedor = document.getElementById("contratos-proximos");
    const lista = document.getElementById("lista-proximos");
    
    if (contenedor && lista) {
        if (contratosPorVencer.length > 0) {
            contenedor.style.display = "block";
            lista.innerHTML = "";
            
            contratosPorVencer.forEach(item => {
                const div = document.createElement("div");
                div.innerHTML = `
                    <p><strong>${item.jugador.nombre}</strong> - ${item.jugador.posicion}</p>
                    <p>Contrato vence en ${item.diasRestantes} día(s)</p>
                    <p>Club: ${item.jugador.club}</p>
                    <hr>
                `;
                lista.appendChild(div);
            });
        } else {
            contenedor.style.display = "none";
        }
    }
}

// Función para resetear calendario (útil para desarrollo/testing)
function resetearCalendario() {
    if (confirm("¿Estás seguro de resetear el calendario al 01/01/2025?")) {
        const fechaInicio = new Date("2025-01-01");
        localStorage.setItem("fechaJuego", fechaInicio.toISOString());
        
        actualizarDisplay();
        evaluarRetiros(); // NUEVO: Evaluar retiros al resetear
        verificarContratos();
        notificarCambioFecha();
        
        console.log("📅 Calendario reseteado al 01/01/2025");
    }
}

// Función para guardar historial de jugadores eliminados
function guardarHistorialEliminados(jugadoresEliminados) {
    let historial = JSON.parse(localStorage.getItem('historialEliminados') || '[]');
    
    jugadoresEliminados.forEach(jugador => {
        historial.unshift(jugador); // Agregar al inicio
    });
    
    // Mantener solo los últimos 50 eliminaciones
    if (historial.length > 50) {
        historial = historial.slice(0, 50);
    }
    
    localStorage.setItem('historialEliminados', JSON.stringify(historial));
}

// NUEVAS FUNCIONES GLOBALES PARA COMPATIBILIDAD
window.evaluarRetirosGenerales = evaluarRetiros;
window.obtenerJugadoresRetirados = function() {
    const jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
    return jugadores.filter(jugador => jugador.retirado);
};
window.obtenerJugadoresActivos = function() {
    const jugadores = JSON.parse(localStorage.getItem("jugadores") || "[]");
    return jugadores.filter(jugador => !jugador.retirado);
};
