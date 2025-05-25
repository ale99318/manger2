// SIMULADOR DE FUTBOL - CALENDARIO
// Fecha de inicio: 01/01/2025 - Fecha límite: 31/12/2040

// Variable global para almacenar la fecha actual del juego
let fechaActualJuego = new Date(2025, 0, 1); // 01/01/2025

// Elementos del DOM
const fechaActualElement = document.getElementById('fechaActual');
const eventosElement = document.getElementById('eventosDelDia');
const btnPasarDia = document.getElementById('pasarDia');
const btnPasarMes = document.getElementById('pasarMes');
const btnPasarAno = document.getElementById('pasarAno');

// Array para almacenar eventos recibidos desde otros JS
let eventosJuego = [];

// FUNCIÓN PRINCIPAL: Obtener fecha actual del juego
// Esta función debe ser llamada desde otros HTML/JS para saber qué día es en el juego
function obtenerFechaJuego() {
    return {
        fecha: new Date(fechaActualJuego),
        dia: fechaActualJuego.getDate(),
        mes: fechaActualJuego.getMonth() + 1,
        ano: fechaActualJuego.getFullYear(),
        fechaString: formatearFecha(fechaActualJuego)
    };
}

// Función para formatear la fecha como DD/MM/YYYY
function formatearFecha(fecha) {
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const ano = fecha.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

// Función para actualizar la visualización de la fecha
function actualizarVisualizacion() {
    fechaActualElement.textContent = formatearFecha(fechaActualJuego);
    mostrarEventosDelDia();
}

// Función para verificar si hemos llegado al límite de fecha (31/12/2040)
function verificarLimiteFecha() {
    const fechaLimite = new Date(2040, 11, 31); // 31/12/2040
    return fechaActualJuego > fechaLimite;
}

// BOTÓN PASAR DÍA: Avanza un día
function pasarDia() {
    if (verificarLimiteFecha()) {
        alert('Has llegado al final del simulador (31/12/2040)');
        return;
    }
    
    fechaActualJuego.setDate(fechaActualJuego.getDate() + 1);
    actualizarVisualizacion();
    
    // Notificar cambio de fecha a otros sistemas
    notificarCambioFecha();
}

// BOTÓN PASAR MES: Avanza un mes
function pasarMes() {
    if (verificarLimiteFecha()) {
        alert('Has llegado al final del simulador (31/12/2040)');
        return;
    }
    
    fechaActualJuego.setMonth(fechaActualJuego.getMonth() + 1);
    actualizarVisualizacion();
    
    // Notificar cambio de fecha a otros sistemas
    notificarCambioFecha();
}

// BOTÓN PASAR AÑO: Avanza un año
function pasarAno() {
    if (verificarLimiteFecha()) {
        alert('Has llegado al final del simulador (31/12/2040)');
        return;
    }
    
    fechaActualJuego.setFullYear(fechaActualJuego.getFullYear() + 1);
    actualizarVisualizacion();
    
    // Notificar cambio de fecha a otros sistemas
    notificarCambioFecha();
}

// Función para notificar cambios de fecha a otros sistemas del juego
function notificarCambioFecha() {
    // Crear evento personalizado para notificar cambio de fecha
    const evento = new CustomEvent('cambioFechaJuego', {
        detail: obtenerFechaJuego()
    });
    document.dispatchEvent(evento);
}

// FUNCIÓN PARA RECIBIR EVENTOS DESDE OTROS JS
// Función para agregar eventos al calendario desde otros archivos JS
function agregarEvento(nombreEvento, descripcion, fecha = null) {
    const eventoObj = {
        nombre: nombreEvento, // Puedes editar este nombre desde tu JS
        descripcion: descripcion,
        fecha: fecha || new Date(fechaActualJuego)
    };
    
    eventosJuego.push(eventoObj);
    mostrarEventosDelDia();
}

// Función para mostrar eventos del día actual
function mostrarEventosDelDia() {
    const eventosHoy = eventosJuego.filter(evento => {
        return evento.fecha.toDateString() === fechaActualJuego.toDateString();
    });
    
    eventosElement.innerHTML = '';
    
    if (eventosHoy.length === 0) {
        eventosElement.innerHTML = '<p>No hay eventos para hoy</p>';
    } else {
        eventosHoy.forEach(evento => {
            const eventoDiv = document.createElement('div');
            eventoDiv.className = 'evento-item';
            eventoDiv.innerHTML = `
                <strong>${evento.nombre}</strong><br>
                <span>${evento.descripcion}</span>
            `;
            eventosElement.appendChild(eventoDiv);
        });
    }
}

// Event listeners para los botones
btnPasarDia.addEventListener('click', pasarDia);
btnPasarMes.addEventListener('click', pasarMes);
btnPasarAno.addEventListener('click', pasarAno);

// Inicializar la visualización al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarVisualizacion();
});

// IMPORTANTE: Esta función debe ser accesible globalmente para otros HTML/JS
window.obtenerFechaJuego = obtenerFechaJuego;
window.agregarEvento = agregarEvento;
