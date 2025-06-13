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
    cargarEntrenamientos();
    cargarJugadores();
    cargarAsignaciones();
    actualizarEntrenamientosAsignados();
});

// Cargar y mostrar entrenamientos
function cargarEntrenamientos() {
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

// Cargar jugadores desde localStorage y popular select
function cargarJugadores() {
    const clubSeleccionado = localStorage.getItem('selectedClub');
    console.log("Club seleccionado en entrenamientos:", clubSeleccionado);
    
    const jugadoresData = localStorage.getItem('jugadoresPorClub');
    console.log("Datos de jugadores en localStorage:", jugadoresData);

    if (!jugadoresData) {
        alert('No se encontró plantilla generada.');
        return;
    }

    let jugadoresPorClub;
    try {
        jugadoresPorClub = JSON.parse(jugadoresData);
    } catch (error) {
        alert('Error al cargar los datos de jugadores.');
        console.error(error);
        return;
    }

    jugadores = [];
    if (typeof clubes !== 'undefined') {
        const club = clubes.find(c => c.nombre === clubSeleccionado);
        if (club && jugadoresPorClub && jugadoresPorClub[club.id]) {
            jugadores = jugadoresPorClub[club.id];
            console.log("Jugadores cargados para el club:", jugadores);
        } else {
            console.error("No se encontraron jugadores para el club:", club);
        }
    }

    // Poblar select de jugadores
    selectJugador.innerHTML = '';
    jugadores.forEach(jugador => {
        const option = document.createElement('option');
        option.value = jugador.id;
        option.textContent = jugador.nombre;
        selectJugador.appendChild(option);
    });
    console.log("Jugadores en el select:", selectJugador.innerHTML);
}

// Seleccionar un entrenamiento para asignar
function seleccionarEntrenamiento(id) {
    entrenamientoSeleccionado = entrenamientos.find(ent => ent.id === id);
    if (!entrenamientoSeleccionado) return;
    entrenamientoSeleccionadoText.textContent = `Entrenamiento seleccionado: ${entrenamientoSeleccionado.nombre}`;
    asignacionSection.style.display = 'block';
    selectJugador.focus();
}

// Asignar el entrenamiento al jugador seleccionado
asignarBtn.addEventListener('click', () => {
    const jugadorId = selectJugador.value;
    const jugadorSeleccionado = jugadores.find(j => j.id == jugadorId);

    if (!entrenamientoSeleccionado || !jugadorSeleccionado) {
        alert('Por favor selecciona un entrenamiento y un jugador.');
        return;
    }

    if (!window.autoCalendar || !window.autoCalendar.currentDate) {
        alert('El calendario no está disponible. Recarga la página.');
        return;
    }

    // Obtener la fecha actual del calendario
    const fechaInicio = new Date(window.autoCalendar.currentDate);
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaInicio.getDate() + 6); // 7 días de entrenamiento

    // Inicializar asignaciones para el jugador si no existe
    if (!asignaciones[jugadorId]) {
        asignaciones[jugadorId] = [];
    }

    // Limitar máximo 3 entrenamientos por jugador
    if (asignaciones[jugadorId].length >= 3) {
        alert(`El jugador ${jugadorSeleccionado.nombre} ya tiene el máximo de 3 entrenamientos asignados.`);
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

    alert(`Entrenamiento "${entrenamientoSeleccionado.nombre}" asignado a ${jugadorSeleccionado.nombre} del ${fechaInicio.toLocaleDateString()} al ${fechaFin.toLocaleDateString()}`);

    // Reset y cerrar asignación
    resetAsignacion();
});

// Cancelar asignación
cancelarBtn.addEventListener('click', resetAsignacion);

function resetAsignacion() {
    entrenamientoSeleccionado = null;
    asignacionSection.style.display = 'none';
    entrenamientoSeleccionadoText.textContent = '';
}

// Cargar asignaciones desde localStorage
function cargarAsignaciones() {
    const stored = localStorage.getItem('entrenamientosAsignados');
    if (stored) {
        try {
            asignaciones = JSON.parse(stored);
        } catch {
            asignaciones = {};
        }
    } else {
        asignaciones = {};
    }
}

// Guardar asignaciones en localStorage
function guardarAsignaciones() {
    localStorage.setItem('entrenamientosAsignados', JSON.stringify(asignaciones));
}

// Actualizar visualización de entrenamientos asignados
function actualizarEntrenamientosAsignados() {
    asignadosLista.innerHTML = '';

    if (Object.keys(asignaciones).length === 0) {
        asignadosLista.textContent = 'No hay entrenamientos asignados.';
        return;
    }

    for (const jugadorId in asignaciones) {
        const jugador = jugadores.find(j => j.id == jugadorId);
        if (!jugador) continue;
        const listaEntrenamientos = document.createElement('ul');
        listaEntrenamientos.setAttribute('aria-label', `Entrenamientos asignados a ${jugador.nombre}`);

        const jugadorTitulo = document.createElement('h3');
        jugadorTitulo.textContent = jugador.nombre;
        listaEntrenamientos.appendChild(jugadorTitulo);

        asignaciones[jugadorId].forEach((asignacion, index) => {
            const li = document.createElement('li');
            const fechaIni = new Date(asignacion.fechaInicio).toLocaleDateString();
            const fechaFin = new Date(asignacion.fechaFin).toLocaleDateString();
            li.textContent = `${asignacion.entrenamientoNombre} (${fechaIni} - ${fechaFin})`;

            // Botón eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.setAttribute('aria-label', `Eliminar entrenamiento ${asignacion.entrenamientoNombre} de ${jugador.nombre}`);
            btnEliminar.className = 'btn-eliminar';
            btnEliminar.addEventListener('click', () => {
                eliminarAsignacion(jugadorId, index);
            });
            li.appendChild(btnEliminar);

            listaEntrenamientos.appendChild(li);
        });

        asignadosLista.appendChild(listaEntrenamientos);
    }
}

// Función para eliminar una asignación
function eliminarAsignacion(jugadorId, index) {
    if (!asignaciones[jugadorId]) return;
    asignaciones[jugadorId].splice(index, 1);

    // Si ya no quedan entrenamientos asignados a ese jugador, eliminar la clave
    if (asignaciones[jugadorId].length === 0) {
        delete asignaciones[jugadorId];
    }
    guardarAsignaciones();
    actualizarEntrenamientosAsignados();
}

// Botón volver
btnBack.addEventListener('click', () => {
    window.history.back();
});
