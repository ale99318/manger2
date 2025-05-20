// Obtener el nombre del club guardado en localStorage
const selectedClub = localStorage.getItem("selectedClub");
// Mostrar el nombre del club
document.getElementById("nombre-club").textContent = selectedClub;

// Verificar si hay jugadores vendidos guardados en localStorage
let jugadoresVendidos = JSON.parse(localStorage.getItem("jugadoresVendidos") || "[]");

// Filtrar los jugadores que pertenecen al club y que no están vendidos
const jugadoresDelClub = jugadores.filter(jugador => 
    jugador.club === selectedClub && !jugadoresVendidos.includes(jugador.nombre)
);

// Crear botón de resetear ventas
const botonResetear = document.createElement("button");
botonResetear.textContent = "Resetear Ventas";
botonResetear.onclick = resetearVentas;
document.querySelector(".seccion-club").appendChild(botonResetear);

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
    // Guardar el jugador vendido en localStorage
    jugadoresVendidos.push(nombreJugador);
    localStorage.setItem("jugadoresVendidos", JSON.stringify(jugadoresVendidos));
    
    console.log(`Jugador ${nombreJugador} vendido`);
}

// Función para resetear todas las ventas
function resetearVentas() {
    // Limpiar la lista de jugadores vendidos en localStorage
    localStorage.removeItem("jugadoresVendidos");
    jugadoresVendidos = [];
    
    // Recargar la página para mostrar todos los jugadores de nuevo
    location.reload();
    
    console.log("Ventas reseteadas");
}
