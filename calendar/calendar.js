// calendar.js

// Inicializar el calendario
function initCalendar() {
    const eventosDiv = document.getElementById('eventos');
    eventosDiv.innerHTML = '<p>Cargando eventos...</p>';

    // Simulación de carga de eventos
    setTimeout(() => {
        eventosDiv.innerHTML = '<p>Eventos cargados correctamente.</p>';
        // Aquí puedes agregar más lógica para mostrar eventos
    }, 1000);
}

// Llamar a la función de inicialización
initCalendar();
