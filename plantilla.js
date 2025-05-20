// Obtener el nombre del club guardado en localStorage
const selectedClub = localStorage.getItem("selectedClub");
// Mostrar el nombre del club
document.getElementById("nombre-club").textContent = selectedClub;
// Filtrar los jugadores que pertenecen al club
const jugadoresDelClub = jugadores.filter(jugador => jugador.club === selectedClub);
// Mostrar los jugadores en el contenedor info-club
const contenedor = document.getElementById("info-club");
jugadoresDelClub.forEach(jugador => {
    const div = document.createElement("div");
    div.textContent = jugador.nombre;
    
    // Agregar botón para vender jugador
    const botonVender = document.createElement("button");
    botonVender.textContent = "Vender";
    botonVender.onclick = function() {
        venderJugador(jugador.nombre);
        div.remove(); // Eliminar el elemento de la interfaz
    };
    
    div.appendChild(botonVender);
    contenedor.appendChild(div);
});

// Función para vender un jugador (eliminarlo de la lista)
function venderJugador(nombreJugador) {
    // Encontrar el índice del jugador en el array original
    const indice = jugadores.findIndex(jugador => 
        jugador.nombre === nombreJugador && jugador.club === selectedClub
    );
    
    // Si se encuentra el jugador, eliminarlo del array
    if (indice !== -1) {
        jugadores.splice(indice, 1);
        console.log(`Jugador ${nombreJugador} vendido`);
    }
}
