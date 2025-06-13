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
