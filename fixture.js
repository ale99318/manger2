// GENERADOR DE FIXTURES AUTOMÁTICO PARA TORNEOS
// Se integra con calendario.js para fechas exactas

// Configuración de días de la semana para partidos
const DIAS_PARTIDOS = {
    nacional: [3, 6, 0], // Miércoles, Sábado, Domingo (0=Domingo)
    internacional: [2, 3], // Martes, Miércoles
    final: [6, 0] // Sábado, Domingo para finales
};

// Duración estándar de partidos (en días)
const DURACION_IDA_VUELTA = 14; // 2 semanas entre ida y vuelta
const DURACION_ENTRE_FECHAS = 7; // 1 semana entre fechas de liga

// Almacén global de fixtures generados
let fixturesGenerados = {};
let proximosPartidos = [];

// FUNCIÓN PRINCIPAL: Generar fixture completo de un torneo
function generarFixtureTorneo(torneoId, fechaInicio = null) {
    const torneo = obtenerTorneoPorId(torneoId);
    if (!torneo) {
        console.error(`Torneo ${torneoId} no encontrado`);
        return null;
    }

    console.log(`Generando fixture para: ${torneo.nombre}`);
    
    // Si no se especifica fecha de inicio, usar fecha actual del juego + 1 semana
    if (!fechaInicio) {
        const fechaJuego = window.obtenerFechaJuego();
        fechaInicio = new Date(fechaJuego.fecha);
        fechaInicio.setDate(fechaInicio.getDate() + 7);
    }

    const fixture = {
        torneoId: torneoId,
        nombre: torneo.nombre,
        fechaInicio: fechaInicio,
        fases: [],
        partidos: [],
        equipos: [...torneo.equipos]
    };

    let fechaActual = new Date(fechaInicio);

    // Generar cada fase del torneo
    torneo.fases.forEach((fase, indice) => {
        const partidosFase = generarPartidosFase(fase, torneo.equipos, fechaActual, torneo.tipo);
        
        fixture.fases.push({
            nombre: fase.nombre,
            fechaInicio: new Date(fechaActual),
            partidos: partidosFase
        });
        
        fixture.partidos.push(...partidosFase);
        
        // Actualizar fecha para siguiente fase
        fechaActual = calcularProximaFecha(partidosFase, fechaActual);
    });

    // Guardar fixture generado
    fixturesGenerados[torneoId] = fixture;
    
    // Agregar eventos al calendario
    agregarEventosAlCalendario(fixture);
    
    console.log(`Fixture generado para ${torneo.nombre}:`, fixture);
    return fixture;
}

// Generar partidos para una fase específica
function generarPartidosFase(fase, equipos, fechaInicio, tipoTorneo) {
    const partidos = [];
    let fecha = new Date(fechaInicio);
    
    switch (fase.tipo) {
        case 'todos_contra_todos':
            return generarPartidosLiga(equipos, fecha, fase, tipoTorneo);
            
        case 'grupos':
            return generarPartidosGrupos(equipos, fecha, fase, tipoTorneo);
            
        case 'eliminacion_directa':
            return generarPartidosEliminacion(equipos, fecha, fase, tipoTorneo);
            
        case 'final':
            return generarPartidoFinal(equipos, fecha, fase, tipoTorneo);
            
        default:
            console.warn(`Tipo de fase no reconocido: ${fase.tipo}`);
            return [];
    }
}

// Generar partidos tipo liga (todos contra todos)
function generarPartidosLiga(equipos, fechaInicio, fase, tipoTorneo) {
    const partidos = [];
    const numEquipos = equipos.length;
    let fecha = new Date(fechaInicio);
    
    // Algoritmo Round Robin
    const fechas = [];
    const equiposArray = [...equipos];
    
    // Si es número impar de equipos, agregar "bye"
    if (numEquipos % 2 !== 0) {
        equiposArray.push(null); // null representa "descanso"
    }
    
    const totalEquipos = equiposArray.length;
    const totalFechas = totalEquipos - 1;
    
    // Generar todas las fechas
    for (let fecha_num = 0; fecha_num < totalFechas; fecha_num++) {
        const partidosFecha = [];
        
        for (let i = 0; i < totalEquipos / 2; i++) {
            const equipo1 = equiposArray[i];
            const equipo2 = equiposArray[totalEquipos - 1 - i];
            
            if (equipo1 && equipo2) { // No incluir partidos con "bye"
                partidosFecha.push({
                    local: equipo1,
                    visitante: equipo2,
                    fecha: new Date(fecha),
                    fase: fase.nombre,
                    jornada: fecha_num + 1,
                    tipo: 'ida'
                });
            }
        }
        
        fechas.push(partidosFecha);
        partidos.push(...partidosFecha);
        
        // Rotar equipos (excepto el primero)
        const temp = equiposArray[1];
        for (let i = 1; i < totalEquipos - 1; i++) {
            equiposArray[i] = equiposArray[i + 1];
        }
        equiposArray[totalEquipos - 1] = temp;
        
        // Avanzar fecha una semana
        fecha.setDate(fecha.getDate() + DURACION_ENTRE_FECHAS);
        fecha = ajustarDiaPartido(fecha, tipoTorneo);
    }
    
    // Si es ida y vuelta, generar vuelta
    if (fase.partidos === 'ida_vuelta') {
        fecha.setDate(fecha.getDate() + 14); // 2 semanas de descanso
        
        fechas.forEach((fechaPartidos, index) => {
            const partidosVuelta = fechaPartidos.map(partido => ({
                local: partido.visitante,
                visitante: partido.local,
                fecha: new Date(fecha),
                fase: fase.nombre,
                jornada: totalFechas + index + 1,
                tipo: 'vuelta'
            }));
            
            partidos.push(...partidosVuelta);
            fecha.setDate(fecha.getDate() + DURACION_ENTRE_FECHAS);
            fecha = ajustarDiaPartido(fecha, tipoTorneo);
        });
    }
    
    return partidos;
}

// Generar partidos de eliminación directa
function generarPartidosEliminacion(equipos, fechaInicio, fase, tipoTorneo) {
    const partidos = [];
    let fecha = new Date(fechaInicio);
    
    // Emparejar equipos
    const emparejamientos = [];
    for (let i = 0; i < equipos.length; i += 2) {
        if (equipos[i + 1]) {
            emparejamientos.push([equipos[i], equipos[i + 1]]);
        }
    }
    
    emparejamientos.forEach((pareja, index) => {
        // Partido de ida
        partidos.push({
            local: pareja[0],
            visitante: pareja[1],
            fecha: new Date(fecha),
            fase: fase.nombre,
            llave: index + 1,
            tipo: 'ida'
        });
        
        // Si es ida y vuelta, generar vuelta
        if (fase.partidos === 'ida_vuelta') {
            let fechaVuelta = new Date(fecha);
            fechaVuelta.setDate(fechaVuelta.getDate() + DURACION_IDA_VUELTA);
            fechaVuelta = ajustarDiaPartido(fechaVuelta, tipoTorneo);
            
            partidos.push({
                local: pareja[1],
                visitante: pareja[0],
                fecha: fechaVuelta,
                fase: fase.nombre,
                llave: index + 1,
                tipo: 'vuelta'
            });
        }
        
        // Ajustar fecha para siguiente llave (mismo día si es posible)
        if (index < emparejamientos.length - 1) {
            fecha.setHours(fecha.getHours() + 2); // 2 horas después
        }
    });
    
    return partidos;
}

// Generar partido final
function generarPartidoFinal(equipos, fechaInicio, fase, tipoTorneo) {
    const partidos = [];
    let fecha = new Date(fechaInicio);
    fecha = ajustarDiaPartido(fecha, 'final');
    
    if (equipos.length >= 2) {
        // Partido de ida
        partidos.push({
            local: equipos[0],
            visitante: equipos[1],
            fecha: new Date(fecha),
            fase: fase.nombre,
            tipo: 'ida',
            esFinal: true
        });
        
        // Si es ida y vuelta
        if (fase.partidos === 'ida_vuelta') {
            fecha.setDate(fecha.getDate() + DURACION_IDA_VUELTA);
            fecha = ajustarDiaPartido(fecha, 'final');
            
            partidos.push({
                local: equipos[1],
                visitante: equipos[0],
                fecha: fecha,
                fase: fase.nombre,
                tipo: 'vuelta',
                esFinal: true
            });
        }
    }
    
    return partidos;
}

// Ajustar fecha al día de partido más cercano
function ajustarDiaPartido(fecha, tipoTorneo) {
    const diasPermitidos = DIAS_PARTIDOS[tipoTorneo] || DIAS_PARTIDOS.nacional;
    const diaActual = fecha.getDay();
    
    // Buscar el próximo día permitido
    let diasAgregar = 0;
    let encontrado = false;
    
    for (let i = 0; i < 7 && !encontrado; i++) {
        const diaTest = (diaActual + i) % 7;
        if (diasPermitidos.includes(diaTest)) {
            diasAgregar = i;
            encontrado = true;
        }
    }
    
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setDate(nuevaFecha.getDate() + diasAgregar);
    return nuevaFecha;
}

// Calcular próxima fecha disponible después de una fase
function calcularProximaFecha(partidos, fechaActual) {
    if (partidos.length === 0) return new Date(fechaActual);
    
    // Obtener la fecha más tardía de los partidos
    const fechaMasTardia = partidos.reduce((latest, partido) => {
        return partido.fecha > latest ? partido.fecha : latest;
    }, partidos[0].fecha);
    
    // Agregar 1 semana de descanso
    const proximaFecha = new Date(fechaMasTardia);
    proximaFecha.setDate(proximaFecha.getDate() + 7);
    
    return proximaFecha;
}

// Agregar eventos al calendario del juego
function agregarEventosAlCalendario(fixture) {
    fixture.partidos.forEach(partido => {
        const nombreLocal = obtenerNombreEquipo(partido.local);
        const nombreVisitante = obtenerNombreEquipo(partido.visitante);
        const descripcion = `${nombreLocal} vs ${nombreVisitante} - ${fixture.nombre}`;
        
        // Usar la función del calendario para agregar eventos
        if (window.agregarEvento) {
            window.agregarEvento(
                `⚽ ${partido.fase}${partido.jornada ? ` - Jornada ${partido.jornada}` : ''}`,
                descripcion,
                partido.fecha
            );
        }
    });
}

// Función auxiliar para obtener nombre del equipo por ID
function obtenerNombreEquipo(equipoId) {
    // Esta función debería conectar con tu base de datos de clubes
    // Por ahora retorna el ID
    return `Equipo ${equipoId}`;
}

// Función auxiliar para obtener torneo por ID
function obtenerTorneoPorId(torneoId) {
    // Conectar con torneos.js
    if (window.TorneosData && window.TorneosData.torneos) {
        return window.TorneosData.torneos.find(t => t.id === torneoId);
    }
    return null;
}

// FUNCIONES PÚBLICAS PARA USO EXTERNO

// Obtener fixture de un torneo
function obtenerFixture(torneoId) {
    return fixturesGenerados[torneoId] || null;
}

// Obtener partidos de una fecha específica
function obtenerPartidosPorFecha(fecha) {
    const fechaBuscar = new Date(fecha);
    fechaBuscar.setHours(0, 0, 0, 0);
    
    const partidos = [];
    Object.values(fixturesGenerados).forEach(fixture => {
        fixture.partidos.forEach(partido => {
            const fechaPartido = new Date(partido.fecha);
            fechaPartido.setHours(0, 0, 0, 0);
            
            if (fechaPartido.getTime() === fechaBuscar.getTime()) {
                partidos.push({
                    ...partido,
                    torneo: fixture.nombre
                });
            }
        });
    });
    
    return partidos;
}

// Obtener próximos partidos (siguiente semana)
function obtenerProximosPartidos(dias = 7) {
    const fechaActual = window.obtenerFechaJuego ? window.obtenerFechaJuego().fecha : new Date();
    const fechaLimite = new Date(fechaActual);
    fechaLimite.setDate(fechaLimite.getDate() + dias);
    
    const proximosPartidos = [];
    Object.values(fixturesGenerados).forEach(fixture => {
        fixture.partidos.forEach(partido => {
            if (partido.fecha >= fechaActual && partido.fecha <= fechaLimite) {
                proximosPartidos.push({
                    ...partido,
                    torneo: fixture.nombre
                });
            }
        });
    });
    
    return proximosPartidos.sort((a, b) => a.fecha - b.fecha);
}

// Generar todos los fixtures de torneos nacionales
function generarTodosLosFixtures() {
    console.log('Generando fixtures para todos los torneos...');
    
    const torneos = window.TorneosData ? window.TorneosData.torneos : [];
    const fechaBase = window.obtenerFechaJuego ? window.obtenerFechaJuego().fecha : new Date();
    
    torneos.forEach((torneo, index) => {
        const fechaInicio = new Date(fechaBase);
        
        // Escalonar fechas de inicio para evitar solapamientos
        if (torneo.tipo === 'nacional') {
            fechaInicio.setDate(fechaInicio.getDate() + (index * 3)); // 3 días entre inicios
        } else {
            fechaInicio.setMonth(fechaInicio.getMonth() + 1); // Internacionales empiezan más tarde
        }
        
        generarFixtureTorneo(torneo.id, fechaInicio);
    });
    
    console.log('Todos los fixtures generados:', fixturesGenerados);
}

// Event listener para cambios de fecha del calendario
document.addEventListener('cambioFechaJuego', function(event) {
    console.log('Fecha del juego cambió:', event.detail);
    // Aquí puedes agregar lógica para manejar cambios de fecha
    // Por ejemplo, verificar si hay partidos hoy
});

// Exportar funciones para uso global
window.GeneradorFixtures = {
    generarFixtureTorneo,
    obtenerFixture,
    obtenerPartidosPorFecha,
    obtenerProximosPartidos,
    generarTodosLosFixtures,
    fixturesGenerados
};

// Generar fixtures automáticamente al cargar
document.addEventListener('DOMContentLoaded', function() {
    // Esperar un poco para que se carguen otros scripts
    setTimeout(() => {
        if (window.TorneosData) {
            generarTodosLosFixtures();
        }
    }, 1000);
});
