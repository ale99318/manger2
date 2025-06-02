// Funciones auxiliares para generar valores aleatorios
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Configuración de atributos por liga (basada en el nivel del equipo)
const configPorLiga = {
    "55": { valorMin: 25000, valorMax: 180000, sueldoMin: 1800, sueldoMax: 12000, generalMin: 75, generalMax: 82 },
    "54": { valorMin: 18000, valorMax: 150000, sueldoMin: 1200, sueldoMax: 9000, generalMin: 74, generalMax: 80 },
    "57": { valorMin: 12000, valorMax: 120000, sueldoMin: 900, sueldoMax: 7500, generalMin: 70, generalMax: 77 },
    "56": { valorMin: 10000, valorMax: 100000, sueldoMin: 800, sueldoMax: 6500, generalMin: 68, generalMax: 75 },
    "598": { valorMin: 8000, valorMax: 85000, sueldoMin: 700, sueldoMax: 5500, generalMin: 69, generalMax: 76 },
    "593": { valorMin: 7000, valorMax: 75000, sueldoMin: 600, sueldoMax: 4800, generalMin: 68, generalMax: 74 },
    "51": { valorMin: 6000, valorMax: 65000, sueldoMin: 500, sueldoMax: 4200, generalMin: 65, generalMax: 72 },
    "595": { valorMin: 5000, valorMax: 55000, sueldoMin: 450, sueldoMax: 3800, generalMin: 65, generalMax: 72 },
    "58": { valorMin: 4000, valorMax: 45000, sueldoMin: 350, sueldoMax: 3000, generalMin: 60, generalMax: 67 },
    "591": { valorMin: 3500, valorMax: 40000, sueldoMin: 300, sueldoMax: 2500, generalMin: 60, generalMax: 68 }
};

// Nombres y apellidos para generar jugadores
const nombres = [
    "Carlos", "Juan", "Pedro", "Luis", "Miguel", "Andrés", "Santiago", "Daniel", 
    "Fernando", "Pablo", "Diego", "Javier", "Alejandro", "Roberto", "Mario", 
    "Sergio", "Antonio", "Francisco", "José", "Manuel", "Ricardo", "Eduardo", 
    "Raúl", "Guillermo", "Gonzalo", "Mateo", "Sebastián", "Nicolás", "Gabriel", "Emilio"
];

const apellidos = [
    "García", "López", "Martínez", "González", "Pérez", "Rodríguez", "Sánchez", 
    "Fernández", "Torres", "Ramírez", "Castro", "Vargas", "Herrera", "Mendoza", 
    "Silva", "Jiménez", "Morales", "Ruiz", "Ortega", "Delgado", "Cruz", "Flores", 
    "Ramos", "Aguilar", "Medina", "Romero", "Núñez", "Guerrero", "Peña", "Vega"
];

const posiciones = ["POR", "DEF", "MED", "DEL"];

// Función para obtener la configuración de la liga basada en el ID del club
function obtenerConfigLiga(clubId) {
    const ligaId = clubId.split('-')[0];
    return configPorLiga[ligaId] || configPorLiga["51"]; // Default a Perú si no se encuentra
}

// Función para calcular valor de mercado por habilidad
function calcularValorPorHabilidad(general, potencial, config) {
    let factorBase = 1.0;
    const rangoGeneral = config.generalMax - config.generalMin;
    const posicionEnRango = (general - config.generalMin) / rangoGeneral;
    
    if (posicionEnRango >= 0.9) factorBase = 1.4;
    else if (posicionEnRango >= 0.75) factorBase = 1.2;
    else if (posicionEnRango >= 0.6) factorBase = 1.1;
    else if (posicionEnRango >= 0.4) factorBase = 1.0;
    else if (posicionEnRango >= 0.2) factorBase = 0.9;
    else factorBase = 0.8;
    
    let factorPotencial = 1.0;
    if (potencial >= 90) factorPotencial = 1.3;
    else if (potencial >= 85) factorPotencial = 1.2;
    else if (potencial >= 80) factorPotencial = 1.1;
    
    const rangoValor = config.valorMax - config.valorMin;
    const valorBase = config.valorMin + (rangoValor * posicionEnRango);
    
    return Math.round(valorBase * factorBase * factorPotencial);
}

// Función para calcular sueldo por valor de mercado
function calcularSueldoPorValor(valor, config) {
    const porcentajeValor = (valor - config.valorMin) / (config.valorMax - config.valorMin);
    const rangoSueldo = config.sueldoMax - config.sueldoMin;
    const sueldoBase = config.sueldoMin + (rangoSueldo * porcentajeValor);
    
    const variacion = sueldoBase * 0.2;
    const sueldoFinal = sueldoBase + rand(-variacion, variacion);
    
    return Math.max(config.sueldoMin, Math.round(sueldoFinal));
}

// Función para asignar lesión basada en probabilidad, estado físico y cansancio
function asignarLesion(estadoFisico, cansancio, propensionLesiones) {
    // La probabilidad de lesión aumenta si el estado físico es bajo o el cansancio es alto
    const factorEstadoFisico = (100 - estadoFisico) / 100; // Cuanto más bajo el estado físico, mayor probabilidad
    const factorCansancio = cansancio / 100; // Cuanto más cansado, mayor probabilidad
    const probabilidadBase = (propensionLesiones / 100) * (1 + factorEstadoFisico + factorCansancio);
    const random = Math.random();
    let probabilidadAcumulada = 0;
    
    // Verificar si lesiones está definida (de lesiones.js)
    if (typeof lesiones !== 'undefined') {
        for (const lesion of lesiones) {
            probabilidadAcumulada += lesion.probabilidad * probabilidadBase;
            if (random < probabilidadAcumulada) {
                return {
                    nombre: lesion.nombre,
                    gravedad: lesion.gravedad,
                    diasRecuperacion: lesion.diasRecuperacion,
                    descripcion: lesion.descripcion,
                    diasRestantes: lesion.diasRecuperacion
                };
            }
        }
    }
    
    return null; // Sin lesión
}

// Función para asignar un evento de cansancio inicial (solo actividades fuera del campo)
function asignarEventoCansancioFueraCampo() {
    // Verificar si eventosCansancio está definida (de cansancio.js)
    if (typeof eventosCansancio !== 'undefined' && eventosCansancio.length > 0) {
        // Filtrar solo eventos relacionados con indisciplina o actividades personales
        const eventosFueraCampo = eventosCansancio.filter(evento => 
            evento.tipo.includes("Fiesta") || 
            evento.tipo.includes("Desvelada") || 
            evento.tipo.includes("Ampay") || 
            evento.tipo.includes("Salida") || 
            evento.tipo.includes("Dormir") || 
            evento.tipo.includes("Comer") || 
            evento.tipo.includes("Bebidas") || 
            evento.tipo.includes("Videojuegos") || 
            evento.tipo.includes("Discoteca") || 
            evento.tipo.includes("Viajes personales") || 
            evento.tipo.includes("Entrevistas")
        );
        
        if (eventosFueraCampo.length > 0 && Math.random() < 0.15) { // Solo 15% de probabilidad de un evento fuera del campo
            const index = rand(0, eventosFueraCampo.length - 1);
            return eventosFueraCampo[index];
        }
    }
    return null; // Sin evento en la mayoría de los casos
}

// Función para asignar una actitud al jugador
function asignarActitud() {
    // Verificar si actitudesJugadores está definida (de actitudes.js)
    if (typeof actitudesJugadores !== 'undefined' && actitudesJugadores.length > 0) {
        const index = rand(0, actitudesJugadores.length - 1);
        return actitudesJugadores[index];
    }
    return "Normal"; // Valor por defecto si no está definido
}

// Función para generar un jugador
function generarJugador(clubId, jugadorId) {
    const nombre = nombres[rand(0, nombres.length - 1)];
    const apellido = apellidos[rand(0, apellidos.length - 1)];
    const config = obtenerConfigLiga(clubId);
    
    const general = rand(config.generalMin, config.generalMax);
    const potencialMin = Math.max(general, config.generalMin + 5);
    const potencialMax = Math.min(95, config.generalMax + 10);
    const potencial = rand(potencialMin, potencialMax);
    const valor = calcularValorPorHabilidad(general, potencial, config);
    const sueldo = calcularSueldoPorValor(valor, config);
    
    const edad = rand(18, 35);
    const birthdayMonth = rand(1, 12);
    const birthdayDay = rand(1, new Date(2025, birthdayMonth, 0).getDate());
    const estadoFisicoBase = rand(80, 100); // Estado físico base alto, ya que no hay partidos ni entrenamientos
    const propensionLesiones = rand(10, 50); // Probabilidad base de lesión
    const actitud = asignarActitud(); // Asignar actitud aleatoria
    
    // Asignar un evento de cansancio inicial solo para actividades fuera del campo con baja probabilidad
    const eventoCansancio = asignarEventoCansancioFueraCampo();
    let cansancio = rand(0, 10); // Cansancio inicial bajo, ya que no hay partidos ni entrenamientos
    let estadoFisico = estadoFisicoBase;
    let resistencia = rand(60, 95);
    
    if (eventoCansancio) {
        cansancio = Math.min(100, Math.max(10, cansancio - eventoCansancio.impactoEnergia)); // Ajustar cansancio inicial si hay evento
        resistencia = Math.min(100, Math.max(0, resistencia + eventoCansancio.impactoResistencia)); // Ajustar resistencia
        estadoFisico = Math.min(100, Math.max(50, estadoFisicoBase + eventoCansancio.impactoEnergia / 2)); // Impacto parcial en estado físico
    }
    
    // Generar lesión solo si el estado físico es bajo o cansancio alto (poco probable sin partidos/entrenamientos)
    const lesion = asignarLesion(estadoFisico, cansancio, propensionLesiones);
    
    return {
        id: jugadorId,
        clubId: clubId,
        nombre: `${nombre} ${apellido}`,
        edad: edad,
        birthdayMonth: birthdayMonth,
        birthdayDay: birthdayDay,
        posicion: posiciones[rand(0, posiciones.length - 1)],
        general: general,
        potencial: potencial,
        actitud: actitud, // Actitud o personalidad del jugador
        estadoFisico: estadoFisico,
        cansancio: cansancio,
        valorMercado: valor,
        sueldo: sueldo,
        contratoAnios: rand(1, 5), // Duración del contrato en años
        lesion: lesion, // Puede ser null si no está lesionado
        propensionLesiones: propensionLesiones, // Probabilidad base de lesionarse
        sprint: rand(50, 95),
        regate: rand(50, 95),
        pase: rand(50, 95),
        tiro: rand(50, 95),
        defensa: rand(40, 90),
        resistencia: resistencia
    };
}

// Cargar datos al iniciar
window.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById("generate-btn");
    const saveBtn = document.getElementById("save-btn");
    const statusText = document.getElementById("status-text");
    let currentPlayers = [];
    let jugadoresPorClub = {};
    
    // Obtener el club seleccionado del usuario desde localStorage
    const clubSeleccionado = localStorage.getItem("selectedClub");
    let clubIdSeleccionado = null;
    
    if (clubSeleccionado && typeof clubes !== 'undefined') {
        const club = clubes.find(c => c.nombre === clubSeleccionado);
        if (club) {
            clubIdSeleccionado = club.id;
            statusText.textContent = `Club seleccionado: ${clubSeleccionado}`;
        } else {
            statusText.textContent = "Error: No se encontró el club seleccionado.";
        }
    } else {
        statusText.textContent = "Error: No se ha seleccionado un club.";
    }
    
    // Verificar si ya existen jugadores generados
    const jugadoresExistentes = localStorage.getItem("jugadoresPorClub");
    if (jugadoresExistentes) {
        jugadoresPorClub = JSON.parse(jugadoresExistentes);
        if (clubIdSeleccionado && jugadoresPorClub[clubIdSeleccionado] && jugadoresPorClub[clubIdSeleccionado].length > 0) {
            currentPlayers = jugadoresPorClub[clubIdSeleccionado];
            mostrarJugadores(currentPlayers);
            statusText.textContent = `Plantilla de ${clubSeleccionado} ya generada. Jugadores: ${currentPlayers.length}`;
            generateBtn.disabled = true;
            saveBtn.disabled = true;
        }
    }
    
    // Habilitar generar plantilla si no hay jugadores para el club seleccionado
    if (clubIdSeleccionado && (!jugadoresPorClub[clubIdSeleccionado] || jugadoresPorClub[clubIdSeleccionado].length === 0)) {
        generateBtn.disabled = false;
    }
    
       // Generar jugadores para todos los clubes al hacer clic
    generateBtn.addEventListener("click", () => {
        if (!clubIdSeleccionado) return;
        
        statusText.textContent = `Generando plantillas para todos los clubes...`;
        generateBtn.disabled = true;
        
        let jugadorIdGlobal = 0;
        
        // Verificar el ID más alto existente para evitar duplicados
        const jugadoresExistentes = localStorage.getItem("jugadoresPorClub");
        if (jugadoresExistentes) {
            const existingData = JSON.parse(jugadoresExistentes);
            Object.values(existingData).forEach(clubJugadores => {
                clubJugadores.forEach(jugador => {
                    if (jugador.id >= jugadorIdGlobal) {
                        jugadorIdGlobal = jugador.id + 1;
                    }
                });
            });
        }
        
        // Generar jugadores para cada club
        clubes.forEach(club => {
            const cantidadJugadores = rand(24, 28); // Aproximadamente 26 jugadores por club
            const clubId = club.id;
            
            // Generar solo si no existen jugadores para este club
            if (!jugadoresPorClub[clubId] || jugadoresPorClub[clubId].length === 0) {
                jugadoresPorClub[clubId] = [];
                for (let i = 0; i < cantidadJugadores; i++) {
                    const jugador = generarJugador(clubId, jugadorIdGlobal++);
                    jugadoresPorClub[clubId].push(jugador);
                }
            }
        });
        
        // Mostrar solo los jugadores del club seleccionado
        currentPlayers = jugadoresPorClub[clubIdSeleccionado];
        mostrarJugadores(currentPlayers);
        statusText.textContent = `Plantilla de ${clubSeleccionado} generada. Jugadores: ${currentPlayers.length}. ¡Guarda los cambios!`;
        saveBtn.disabled = false;
    });
    
    // Guardar jugadores en localStorage
    saveBtn.addEventListener("click", () => {
        if (currentPlayers.length === 0) return;
        
        localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
        statusText.textContent = `Plantilla guardada correctamente para todos los clubes.`;
        saveBtn.disabled = true;
        localStorage.setItem("jugadoresGenerados", "true");
    });
});

// Mostrar jugadores en la tabla
function mostrarJugadores(jugadores) {
    const playersTable = document.getElementById("players-table");
    if (jugadores.length === 0) {
        playersTable.innerHTML = "<p id='no-players-msg'>Aún no se han generado jugadores. Haz clic en 'Crear Plantilla Aleatoria' para continuar.</p>";
        return;
    }

    let html = `<table>
        <tr>
            <th>Nombre</th><th>Edad</th><th>Posición</th><th>General</th><th>Potencial</th>
            <th>Actitud</th><th>Estado Físico</th><th>Cansancio</th><th>Valor Mercado ($)</th><th>Sueldo ($)</th>
            <th>Contrato (Años)</th><th>Propensión Lesiones</th><th>Lesión</th>
        </tr>`;
    
    jugadores.forEach(jugador => {
        const lesionText = jugador.lesion ? `${jugador.lesion.nombre} (${jugador.lesion.diasRestantes} días)` : "Ninguna";
        html += `<tr>
            <td>${jugador.nombre}</td>
            <td>${jugador.edad}</td>
            <td>${jugador.posicion}</td>
            <td>${jugador.general}</td>
            <td>${jugador.potencial}</td>
            <td>${jugador.actitud}</td>
            <td>${jugador.estadoFisico}</td>
            <td>${jugador.cansancio}</td>
            <td>${jugador.valorMercado.toLocaleString()}</td>
            <td>${jugador.sueldo.toLocaleString()}</td>
            <td>${jugador.contratoAnios}</td>
            <td>${jugador.propensionLesiones}%</td>
            <td>${lesionText}</td>
        </tr>`;
    });
    
    html += "</table>";
    playersTable.innerHTML = html;
}

// Función para volver al calendario
function goToCalendar() {
    window.location.href = "calendar/calendar.html";
}

// ==================== FUNCIONES PARA INTEGRAR CON EL CALENDARIO ====================

// Función para aplicar degradación diaria por inactividad (debe ser llamada desde calendar.js)
function aplicarDegradacionPorInactividad() {
    const jugadoresData = localStorage.getItem("jugadoresPorClub");
    if (!jugadoresData) return;
    
    const jugadoresPorClub = JSON.parse(jugadoresData);
    let cambiosRealizados = false;
    
    Object.keys(jugadoresPorClub).forEach(clubId => {
        const jugadoresClub = jugadoresPorClub[clubId];
        
        jugadoresClub.forEach(jugador => {
            // Solo aplicar degradación si no hay sistema de entrenamiento activo
            // Degradación muy pequeña: 0.05% del general por día (aproximadamente 1 punto cada 20 días)
            const degradacionDiaria = jugador.general * 0.0005; // 0.05%
            const nuevoGeneral = Math.max(jugador.general - degradacionDiaria, jugador.general * 0.8); // No bajar más del 80% del valor original
            
            if (nuevoGeneral !== jugador.general) {
                jugador.general = Math.round(nuevoGeneral * 100) / 100; // Redondear a 2 decimales
                cambiosRealizados = true;
            }
            
            // También aplicar una pequeña degradación al estado físico si no hay actividad
            if (jugador.estadoFisico > 70) { // Solo si está en buen estado
                const degradacionFisica = 0.1; // 0.1 puntos por día
                jugador.estadoFisico = Math.max(jugador.estadoFisico - degradacionFisica, 70);
                cambiosRealizados = true;
            }
            
            // Reducir cansancio gradualmente si no hay actividad (recuperación natural)
            if (jugador.cansancio > 0) {
                const recuperacionNatural = 2; // 2 puntos de recuperación por día
                jugador.cansancio = Math.max(jugador.cansancio - recuperacionNatural, 0);
                cambiosRealizados = true;
            }
        });
    });
    
    // Guardar cambios si hubo modificaciones
    if (cambiosRealizados) {
        localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
        console.log("Degradación diaria aplicada a los jugadores por inactividad");
    }
}

// Función para aplicar eventos aleatorios de cansancio (debe ser llamada desde calendar.js)
function aplicarEventosAleatoriosCansancio() {
    const jugadoresData = localStorage.getItem("jugadoresPorClub");
    if (!jugadoresData) return;
    
    const jugadoresPorClub = JSON.parse(jugadoresData);
    let eventosAplicados = [];
    
    Object.keys(jugadoresPorClub).forEach(clubId => {
        const jugadoresClub = jugadoresPorClub[clubId];
        
        jugadoresClub.forEach(jugador => {
            // Probabilidad muy baja de evento aleatorio por día (1% por jugador)
            if (Math.random() < 0.01) {
                const evento = asignarEventoCansancioFueraCampo();
                if (evento) {
                    // Aplicar efectos del evento
                    jugador.cansancio = Math.min(100, Math.max(0, jugador.cansancio - evento.impactoEnergia));
                    jugador.resistencia = Math.min(100, Math.max(0, jugador.resistencia + evento.impactoResistencia));
                    jugador.estadoFisico = Math.min(100, Math.max(50, jugador.estadoFisico + evento.impactoEnergia / 2));
                    
                    eventosAplicados.push({
                        jugador: jugador.nombre,
                        evento: evento.tipo,
                        descripcion: evento.descripcion
                    });
                }
            }
        });
    });
    
    // Guardar cambios si hubo eventos
    if (eventosAplicados.length > 0) {
        localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
        console.log("Eventos aleatorios aplicados:", eventosAplicados);
        return eventosAplicados; // Retornar para mostrar en el calendario
    }
    
    return [];
}

// Función para procesar recuperación de lesiones (debe ser llamada desde calendar.js)
function procesarRecuperacionLesiones() {
    const jugadoresData = localStorage.getItem("jugadoresPorClub");
    if (!jugadoresData) return;
    
    const jugadoresPorClub = JSON.parse(jugadoresData);
    let jugadoresRecuperados = [];
    
    Object.keys(jugadoresPorClub).forEach(clubId => {
        const jugadoresClub = jugadoresPorClub[clubId];
        
        jugadoresClub.forEach(jugador => {
            if (jugador.lesion && jugador.lesion.diasRestantes > 0) {
                jugador.lesion.diasRestantes--;
                
                // Si se recuperó completamente
                if (jugador.lesion.diasRestantes <= 0) {
                    jugadoresRecuperados.push({
                        nombre: jugador.nombre,
                        lesion: jugador.lesion.nombre
                    });
                    jugador.lesion = null; // Quitar la lesión
                }
            }
        });
    });
    
    // Guardar cambios si hubo recuperaciones
    if (jugadoresRecuperados.length > 0) {
        localStorage.setItem("jugadoresPorClub", JSON.stringify(jugadoresPorClub));
        console.log("Jugadores recuperados de lesiones:", jugadoresRecuperados);
        return jugadoresRecuperados; // Retornar para mostrar en el calendario
    }
    
    return [];
}

// Exportar funciones para uso en calendar.js (si es necesario)
if (typeof window !== 'undefined') {
    window.aplicarDegradacionPorInactividad = aplicarDegradacionPorInactividad;
    window.aplicarEventosAleatoriosCansancio = aplicarEventosAleatoriosCansancio;
    window.procesarRecuperacionLesiones = procesarRecuperacionLesiones;
}

    
