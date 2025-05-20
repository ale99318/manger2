// plantilla.js 

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
    contenedor.appendChild(div);
});
