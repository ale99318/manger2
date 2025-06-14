// Datos de los entrenamientos
const entrenamientos = [
    { id: 1, nombre: "Sprint explosivo", mejora: "Velocidad, Aceleración", puntos: "1 a 3" },
    { id: 2, nombre: "Tiro al arco", mejora: "Tiro, Precisión, Potencia de disparo", puntos: "1 a 4" },
    { id: 3, nombre: "Control de balón", mejora: "Regate, Técnica, Primer toque", puntos: "1 a 3" },
    { id: 4, nombre: "Pases en corto", mejora: "Pase corto, Visión de juego", puntos: "1 a 3" },
    { id: 5, nombre: "Lectura táctica", mejora: "Inteligencia, Posicionamiento, Defensa", puntos: "1 a 2" },
    { id: 6, nombre: "Resistencia física", mejora: "Energía, Stamina, Recuperación", puntos: "2 a 5" },
    { id: 7, nombre: "Entrenamiento defensivo", mejora: "Marcaje, Entrada, Anticipación", puntos: "1 a 4" },
    { id: 8, nombre: "Juego aéreo", mejora: "Cabeceo, Salto, Aerial", puntos: "1 a 3" },
    { id: 9, nombre: "Trabajo de fuerza", mejora: "Fuerza física, Duelo cuerpo a cuerpo", puntos: "1 a 3" },
    { id: 10, nombre: "Penales y tiros libres", mejora: "Tiros especiales, Concentración, Técnica", puntos: "1 a 2" }
];

let jugadores = []; // Lista de jugadores del club
let entrenamientoSeleccionado = null;
let asignaciones = {}; // Asignaciones cargadas desde localStorage

// Componentes DOM
const containerEntrenamientos = document.getElementById('entrenamientos-container');
const asignacionSection = document.getElementById('asignacion-entrenamiento');
const entrenamientoSeleccionadoText = document.getElementById('entrenamiento-seleccionado');
const selectJugador = document.getElementById('jugador-seleccionado');
const asignarBtn = document.getElementById('asignar-btn');
const cancelarBtn = document.getElementById('cancelar-btn');
const asignadosLista = document.getElementById('asignados-lista');
const btnBack = document.getElementById('btn-back');

document.addEventListener('DOMContentLoaded', () => {
    // Verificar que todos los elementos DOM existan
    if (!verificarElementosDOM()) {
        console.error('Faltan elementos DOM necesarios');
        return;
    }
    
    cargarEntrenamientos();
    cargarJugadores();
    cargarAsignaciones();
    limpiarEntrenamientosExpirados(); // NUEVO: Limpiar entrenamientos expirados
    actualizarEntrenamientosAsignados();
    
    // NUEVO: Configurar actualización automática cada 5 segundos
    setInterval(() => {
        limpiarEntrenamientosExpirados();
        actualizarEntrenamientosAsignados();
    }, 5000);
});

// NUEVA FUNCIÓN: Obtener fecha actual del calendario
function obtenerFechaActualCalendario() {
    // Intentar obtener la fecha del calendario automático
    if (window.autoCalendar && window.autoCalendar.currentDate) {
        return new Date(window.autoCalendar.currentDate);
    }
    
    // Fallback: obtener de localStorage
    const savedDate = localStorage.getItem("currentCalendarDate");
    if (savedDate) {
        return new Date(savedDate);
    }
    
    // Último fallback: fecha actual del sistema
    console.warn('No se pudo obtener fecha del calendario, usando fecha del sistema');
    return new Date();
}

// NUEVA FUNCIÓN: Limpiar entrenamientos expirados
function limpiarEntrenamientosExpirados() {
    const fechaActual = obtenerFechaActualCalendario();
    let entrenamientosEliminados = 0;
    let cambiosRealizados = false;
    
    // Normalizar fecha actual (solo fecha, sin horas)
    const fechaActualNormalizada = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
    
    for (const jugadorId in asignaciones) {
        const entrenamientosJugador = asignaciones[jugadorId];
        
        // Filtrar entrenamientos que no han expirado
        const entrenamientosActivos = entrenamientosJugador.filter(asignacion => {
            const fechaFin = new Date(asignacion.fechaFin);
            const fechaFinNormalizada = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), fechaFin.getDate());
            
            // Si la fecha actual es mayor que la fecha fin, el entrenamiento ha expirado
            if (fechaActualNormalizada > fechaFinNormalizada) {
                entrenamientosEliminados++;
                
                // Buscar nombre del jugador para el log
                const jugador = jugadores.find(j => j.id == jugadorId);
                const nombreJugador = jugador ? jugador.nombre : `Jugador ID ${jugadorId}`;
                
                console.log(`🏁 Entrenamiento "${asignacion.entrenamientoNombre}" de ${nombreJugador} ha finalizado`);
                return false; // Eliminar este entrenamiento
            }
            return true; // Mantener este entrenamiento
        });
        
        // Actualizar asignaciones del jugador
        if (entrenamientosActivos.length !== entrenamientosJugador.length) {
            if (entrenamientosActivos.length === 0) {
                delete asignaciones[jugadorId]; // Eliminar jugador si no tiene entrenamientos
            } else {
                asignaciones[jugadorId] = entrenamientosActivos;
            }
            cambiosRealizados = true;
        }
    }
    
    // Guardar cambios si se eliminaron entrenamientos
    if (cambiosRealizados) {
        guardarAsignaciones();
        
        if (entrenamientosEliminados > 0) {
            console.log(`🧹 Se eliminaron ${entrenamientosEliminados} entrenamientos expirados`);
            
            // Mostrar notificación visual si estamos en la página de entrenamientos
            if (containerEntrenamientos) {
                mostrarInfo(`Se completaron ${entrenamientosEliminados} entrenamientos`);
            }
        }
    }
}

// NUEVA FUNCIÓN: Mostrar mensajes informativos
function mostrarInfo(mensaje) {
    const infoDiv = document.createElement('div');
    infoDiv.className = 'info-message';
    infoDiv.style.cssText = `
        background: #2196F3;
        color: white;
        padding: 10px;
        margin: 10px 0;
        border-radius: 5px;
        text-align: center;
    `;
    infoDiv.textContent = mensaje;
    
    const container = containerEntrenamientos || document.body;
    container.insertBefore(infoDiv, container.firstChild);
    
    setTimeout(() => {
        if (infoDiv.parentNode) {
            infoDiv.parentNode.removeChild(infoDiv);
        }
    }, 4000);
}

// ✅ Nueva función para verificar elementos DOM
function verificarElementosDOM() {
    const elementos = [
        'entrenamientos-container',
        'asignacion-entrenamiento', 
        'entrenamiento-seleccionado',
        'jugador-seleccionado',
        'asignar-btn',
        'cancelar-btn',
        'asignados-lista',
        'btn-back'
    ];
    
    return elementos.every(id => {
        const elemento = document.getElementById(id);
        if (!elemento) {
            console.error(`Elemento con ID '${id}' no encontrado`);
            return false;
        }
        return true;
    });
}

// Cargar y mostrar entrenamientos
function cargarEntrenamientos() {
    if (!containerEntrenamientos) {
        console.error('Container de entrenamientos no encontrado');
        return;
    }
    
    containerEntrenamientos.innerHTML = entrenamientos.map(ent =>
        `<div class="entrenamiento-card" tabindex="0" role="button" aria-pressed="false" 
            onclick="seleccionarEntrenamiento(${ent.id})" 
            onkeydown="if(event.key === 'Enter' || event.key === ' ') seleccionarEntrenamiento(${ent.id})">
            <h3>${ent.nombre}</h3>
            <p>Mejora: ${ent.mejora}</p>
            <p>Puntos: ${ent.puntos}</p>
        </div>`
    ).join('');
}

// ✅ Cargar jugadores mejorado
function cargarJugadores() {
    const clubSeleccionado = localStorage.getItem('selectedClub');
    console.log("Club seleccionado en entrenamientos:", clubSeleccionado);
    
    if (!clubSeleccionado) {
        console.error('No hay club seleccionado');
        mostrarError('No se ha seleccionado ningún club. Por favor, selecciona un club primero.');
        return;
    }
    
    const jugadoresData = localStorage.getItem('jugadoresPorClub');
    console.log("Datos de jugadores en localStorage:", jugadoresData);

    if (!jugadoresData) {
        mostrarError('No se encontró plantilla generada. Por favor, genera la plantilla primero.');
        return;
    }

    let jugadoresPorClub;
    try {
        jugadoresPorClub = JSON.parse(jugadoresData);
    } catch (error) {
        mostrarError('Error al cargar los datos de jugadores.');
        console.error('Error parsing jugadores:', error);
        return;
    }

    jugadores = [];
    
    // ✅ Verificación corregida
    if (typeof window.clubes !== 'undefined' && window.clubes) {
        const club = window.clubes.find(c => c.nombre === clubSeleccionado);
        if (club && jugadoresPorClub && jugadoresPorClub[club.id]) {
            jugadores = jugadoresPorClub[club.id];
            console.log("Jugadores cargados para el club:", jugadores);
        } else {
            console.error("No se encontraron jugadores para el club:", club);
            mostrarError(`No se encontraron jugadores para el club ${clubSeleccionado}`);
        }
    } else {
        // ✅ Fallback si no existe window.clubes
        console.warn('Variable clubes no disponible, intentando cargar directamente');
        // Buscar por nombre del club en los datos
        for (const clubId in jugadoresPorClub) {
            if (jugadoresPorClub[clubId] && jugadoresPorClub[clubId].length > 0) {
                // Verificar si algún jugador pertenece al club seleccionado
                const primerJugador = jugadoresPorClub[clubId][0];
                if (primerJugador.club === clubSeleccionado) {
                    jugadores = jugadoresPorClub[clubId];
                    break;
                }
            }
        }
    }

    // Poblar select de jugadores
    if (!selectJugador) {
        console.error('Select de jugadores no encontrado');
        return;
    }
    
    selectJugador.innerHTML = '<option value="">Selecciona un jugador</option>';
    
    if (jugadores.length === 0) {
        selectJugador.innerHTML += '<option value="" disabled>No hay jugadores disponibles</option>';
        return;
    }
    
    jugadores.forEach(jugador => {
        const option = document.createElement('option');
        option.value = jugador.id;
        option.textContent = `${jugador.nombre} (${jugador.posicion})`;
        selectJugador.appendChild(option);
    });
    
    console.log("Jugadores cargados en el select:", jugadores.length);
}

// ✅ Nueva función para mostrar errores
function mostrarError(mensaje) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: #ff4444;
        color: white;
        padding: 10px;
        margin: 10px 0;
        border-radius: 5px;
        text-align: center;
    `;
    errorDiv.textContent = mensaje;
    
    // Insertar al inicio del body o en un container específico
    const container = containerEntrenamientos || document.body;
    container.insertBefore(errorDiv, container.firstChild);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

// Seleccionar un entrenamiento para asignar
function seleccionarEntrenamiento(id) {
    entrenamientoSeleccionado = entrenamientos.find(ent => ent.id === id);
    if (!entrenamientoSeleccionado) {
        console.error('Entrenamiento no encontrado:', id);
        return;
    }
    
    if (jugadores.length === 0) {
        mostrarError('No hay jugadores disponibles. Por favor, carga la plantilla primero.');
        return;
    }
    
    entrenamientoSeleccionadoText.textContent = `Entrenamiento seleccionado: ${entrenamientoSeleccionado.nombre}`;
    asignacionSection.style.display = 'block';
    
    // Focus en el select solo si tiene opciones
    if (selectJugador.children.length > 1) {
        selectJugador.focus();
    }
}

// ✅ Event listeners mejorados
if (asignarBtn) {
    asignarBtn.addEventListener('click', asignarEntrenamiento);
}

if (cancelarBtn) {
    cancelarBtn.addEventListener('click', resetAsignacion);
}

if (btnBack) {
    btnBack.addEventListener('click', () => {
        window.history.back();
    });
}

// ✅ Función asignar separada para mejor manejo
function asignarEntrenamiento() {
    const jugadorId = selectJugador.value;
    const jugadorSeleccionado = jugadores.find(j => j.id == jugadorId);

    if (!entrenamientoSeleccionado || !jugadorSeleccionado) {
        mostrarError('Por favor selecciona un entrenamiento y un jugador.');
        return;
    }

    // ✅ Usar fecha del calendario automático
    const fechaInicio = obtenerFechaActualCalendario();
    const fechaFin = new Date(fechaInicio);
       fechaFin.setDate(fechaInicio.getDate() + 6); // 7 días de entrenamiento

    // Inicializar asignaciones para el jugador si no existe
    if (!asignaciones[jugadorId]) {
        asignaciones[jugadorId] = [];
    }

    // Limitar máximo 3 entrenamientos por jugador
    if (asignaciones[jugadorId].length >= 3) {
        mostrarError(`El jugador ${jugadorSeleccionado.nombre} ya tiene el máximo de 3 entrenamientos asignados.`);
        return;
    }

    // Verificar si ya tiene este entrenamiento asignado
    const yaAsignado = asignaciones[jugadorId].some(a => a.entrenamientoId === entrenamientoSeleccionado.id);
    if (yaAsignado) {
        mostrarError(`El jugador ${jugadorSeleccionado.nombre} ya tiene asignado este entrenamiento.`);
        return;
    }

    // Agregar asignación
    asignaciones[jugadorId].push({
        entrenamientoId: entrenamientoSeleccionado.id,
        entrenamientoNombre: entrenamientoSeleccionado.nombre,
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString()
    });

    guardarAsignaciones();
    actualizarEntrenamientosAsignados();

    // ✅ Mensaje de éxito mejorado
    mostrarExito(`Entrenamiento "${entrenamientoSeleccionado.nombre}" asignado a ${jugadorSeleccionado.nombre} del ${fechaInicio.toLocaleDateString()} al ${fechaFin.toLocaleDateString()}`);

    // Reset y cerrar asignación
    resetAsignacion();
}

// ✅ Nueva función para mostrar mensajes de éxito
function mostrarExito(mensaje) {
    const exitoDiv = document.createElement('div');
    exitoDiv.className = 'success-message';
    exitoDiv.style.cssText = `
        background: #44aa44;
        color: white;
        padding: 10px;
        margin: 10px 0;
        border-radius: 5px;
        text-align: center;
    `;
    exitoDiv.textContent = mensaje;
    
    const container = containerEntrenamientos || document.body;
    container.insertBefore(exitoDiv, container.firstChild);
    
    setTimeout(() => {
        if (exitoDiv.parentNode) {
            exitoDiv.parentNode.removeChild(exitoDiv);
        }
    }, 3000);
}

// Cancelar asignación
function resetAsignacion() {
    entrenamientoSeleccionado = null;
    if (asignacionSection) {
        asignacionSection.style.display = 'none';
    }
    if (entrenamientoSeleccionadoText) {
        entrenamientoSeleccionadoText.textContent = '';
    }
    if (selectJugador) {
        selectJugador.value = '';
    }
}

// Cargar asignaciones desde localStorage
function cargarAsignaciones() {
    const stored = localStorage.getItem('entrenamientosAsignados');
    if (stored) {
        try {
            asignaciones = JSON.parse(stored);
        } catch (error) {
            console.error('Error cargando asignaciones:', error);
            asignaciones = {};
        }
    } else {
        asignaciones = {};
    }
}

// Guardar asignaciones en localStorage
function guardarAsignaciones() {
    try {
        localStorage.setItem('entrenamientosAsignados', JSON.stringify(asignaciones));
    } catch (error) {
        console.error('Error guardando asignaciones:', error);
        mostrarError('Error al guardar las asignaciones');
    }
}

// MODIFICADO: Actualizar visualización con estado de entrenamientos
function actualizarEntrenamientosAsignados() {
    if (!asignadosLista) {
        console.error('Lista de asignados no encontrada');
        return;
    }
    
    asignadosLista.innerHTML = '';

    if (Object.keys(asignaciones).length === 0) {
        const mensajeVacio = document.createElement('p');
        mensajeVacio.textContent = 'No hay entrenamientos asignados.';
        mensajeVacio.className = 'mensaje-vacio';
        mensajeVacio.style.cssText = 'text-align: center; color: #666; padding: 20px;';
        asignadosLista.appendChild(mensajeVacio);
        return;
    }

    const fechaActual = obtenerFechaActualCalendario();

    for (const jugadorId in asignaciones) {
        const jugador = jugadores.find(j => j.id == jugadorId);
        if (!jugador) {
            console.warn(`Jugador con ID ${jugadorId} no encontrado`);
            continue;
        }
        
        const jugadorContainer = document.createElement('div');
        jugadorContainer.className = 'jugador-entrenamientos';
        jugadorContainer.style.cssText = 'margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9;';

        const jugadorTitulo = document.createElement('h3');
        jugadorTitulo.textContent = `${jugador.nombre} (${jugador.posicion})`;
        jugadorTitulo.style.cssText = 'margin-bottom: 10px; color: #333;';
        jugadorContainer.appendChild(jugadorTitulo);

        const listaEntrenamientos = document.createElement('ul');
        listaEntrenamientos.setAttribute('aria-label', `Entrenamientos asignados a ${jugador.nombre}`);
        listaEntrenamientos.style.cssText = 'list-style: none; padding: 0;';

        asignaciones[jugadorId].forEach((asignacion, index) => {
            const li = document.createElement('li');
            li.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;';
            
            const fechaIni = new Date(asignacion.fechaInicio);
            const fechaFin = new Date(asignacion.fechaFin);
            
            // NUEVO: Calcular estado del entrenamiento
            const esActivo = fechaActual >= fechaIni && fechaActual <= fechaFin;
            const esFuturo = fechaActual < fechaIni;
            const diasRestantes = Math.ceil((fechaFin - fechaActual) / (1000 * 60 * 60 * 24));
            
            const infoSpan = document.createElement('span');
            let estadoTexto = '';
            let colorEstado = '#666';
            
            if (esFuturo) {
                estadoTexto = ' (Próximo)';
                colorEstado = '#2196F3';
            } else if (esActivo) {
                estadoTexto = ` (Activo - ${diasRestantes} días restantes)`;
                colorEstado = '#4CAF50';
            }
            
            infoSpan.innerHTML = `
                ${asignacion.entrenamientoNombre} 
                <small style="color: ${colorEstado};">${estadoTexto}</small>
                <br>
                <small>(${fechaIni.toLocaleDateString()} - ${fechaFin.toLocaleDateString()})</small>
            `;
            infoSpan.style.cssText = 'flex: 1;';
            
            // Botón eliminar mejorado
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = '✕';
            btnEliminar.setAttribute('aria-label', `Eliminar entrenamiento ${asignacion.entrenamientoNombre} de ${jugador.nombre}`);
            btnEliminar.className = 'btn-eliminar';
            btnEliminar.style.cssText = `
                background: #ff4444;
                color: white;
                border: none;
                border-radius: 4px;
                width: 30px;
                height: 30px;
                cursor: pointer;
                font-size: 14px;
                margin-left: 10px;
                transition: background 0.3s;
            `;
            
            // Hover effect
            btnEliminar.addEventListener('mouseenter', () => {
                btnEliminar.style.background = '#cc0000';
            });
            btnEliminar.addEventListener('mouseleave', () => {
                btnEliminar.style.background = '#ff4444';
            });
            
            btnEliminar.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm(`¿Estás seguro de eliminar el entrenamiento "${asignacion.entrenamientoNombre}" de ${jugador.nombre}?`)) {
                    eliminarAsignacion(jugadorId, index);
                }
            });
            
            li.appendChild(infoSpan);
            li.appendChild(btnEliminar);
            listaEntrenamientos.appendChild(li);
        });

        jugadorContainer.appendChild(listaEntrenamientos);
        asignadosLista.appendChild(jugadorContainer);
    }
}

// Función para eliminar una asignación (mejorada)
function eliminarAsignacion(jugadorId, index) {
    if (!asignaciones[jugadorId] || !asignaciones[jugadorId][index]) {
        console.error('Asignación no encontrada');
        return;
    }
    
    const asignacionEliminada = asignaciones[jugadorId][index];
    asignaciones[jugadorId].splice(index, 1);

    // Si ya no quedan entrenamientos asignados a ese jugador, eliminar la clave
    if (asignaciones[jugadorId].length === 0) {
        delete asignaciones[jugadorId];
    }
    
    guardarAsignaciones();
    actualizarEntrenamientosAsignados();
    
    // Mensaje de confirmación
    const jugador = jugadores.find(j => j.id == jugadorId);
    if (jugador) {
        mostrarExito(`Entrenamiento "${asignacionEliminada.entrenamientoNombre}" eliminado de ${jugador.nombre}`);
    }
}

// ✅ Función adicional para limpiar todas las asignaciones (útil para debug)
function limpiarTodasAsignaciones() {
    if (confirm('¿Estás seguro de eliminar TODAS las asignaciones de entrenamientos?')) {
        asignaciones = {};
        guardarAsignaciones();
        actualizarEntrenamientosAsignados();
        mostrarExito('Todas las asignaciones han sido eliminadas');
    }
}

// ✅ Función para exportar asignaciones (útil para backup)
function exportarAsignaciones() {
    const dataStr = JSON.stringify(asignaciones, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `entrenamientos_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    mostrarExito('Asignaciones exportadas correctamente');
}

// ✅ Función para validar integridad de datos
function validarDatos() {
    const errores = [];
    
    // Verificar localStorage
    if (!localStorage.getItem('selectedClub')) {
        errores.push('No hay club seleccionado');
    }
    
    if (!localStorage.getItem('jugadoresPorClub')) {
        errores.push('No hay datos de jugadores');
    }
    
    // Verificar jugadores cargados
    if (jugadores.length === 0) {
        errores.push('No se han cargado jugadores');
    }
    
    // Verificar elementos DOM
    const elementosRequeridos = [
        'entrenamientos-container',
        'asignacion-entrenamiento', 
        'entrenamiento-seleccionado',
        'jugador-seleccionado',
        'asignar-btn',
        'cancelar-btn',
        'asignados-lista',
        'btn-back'
    ];
    
    elementosRequeridos.forEach(id => {
        if (!document.getElementById(id)) {
            errores.push(`Elemento DOM '${id}' no encontrado`);
        }
    });
    
    if (errores.length > 0) {
        console.error('Errores encontrados:', errores);
        mostrarError(`Errores detectados: ${errores.join(', ')}`);
        return false;
    }
    
    return true;
}

// ✅ Inicialización con validación
document.addEventListener('DOMContentLoaded', () => {
    console.log('Iniciando sistema de entrenamientos...');
    
    // Validar antes de continuar
    setTimeout(() => {
        if (validarDatos()) {
            console.log('Validación exitosa, cargando datos...');
        } else {
            console.error('Validación falló');
        }
    }, 100);
});

// ✅ Debugging helpers (solo para desarrollo)
if (typeof window !== 'undefined') {
    window.debugEntrenamientos = {
        asignaciones,
        jugadores,
        limpiarTodo: limpiarTodasAsignaciones,
        exportar: exportarAsignaciones,
        validar: validarDatos,
        obtenerFecha: obtenerFechaActualCalendario,
        limpiarExpirados: limpiarEntrenamientosExpirados,
        recargar: () => {
            cargarJugadores();
            cargarAsignaciones();
            limpiarEntrenamientosExpirados();
            actualizarEntrenamientosAsignados();
        }
    };
}
